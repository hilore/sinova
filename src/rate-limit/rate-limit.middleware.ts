import {
  Inject,
  Injectable,
  NestMiddleware,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import {Request, Response, NextFunction} from "express";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {Cache} from "cache-manager";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const currentTime = Math.floor(Date.now() / 1000);
    const limitNumber = this.configService.get<number>("rateLimit.number") || 10;

    const clientData = await this.cacheManager.get<{count: number, timestamp: number}>(req.ip) || 0;

    if (clientData) {
      if (currentTime - clientData.timestamp < 60) {
        if (clientData.count >= limitNumber) {
          throw new HttpException("Rate limit exceeded", HttpStatus.TOO_MANY_REQUESTS);
        } else {
          await this.cacheManager.set(req.ip, {
            count: clientData.count + 1,
            timestamp: clientData.timestamp
          });
        }
      } else {
        await this.cacheManager.set(req.ip, {count: 1, timestamp: currentTime});
      }
    } else {
      await this.cacheManager.set(req.ip, {count: 1, timestamp: currentTime});
    }

    next();
  }
}
