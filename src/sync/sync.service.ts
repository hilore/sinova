import { Injectable, Logger } from '@nestjs/common';
import {UrlService} from "../url/url.service";
import {Cron} from "@nestjs/schedule";

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(private readonly urlService: UrlService) {}

  @Cron("*/10 * * * *")
  async syncRedisToMongo() {
    this.logger.log("Syncing Redis to Mongo");
    await this.urlService.syncClicksFromCache();
  }
}
