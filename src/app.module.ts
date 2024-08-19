import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlModule } from './url/url.module';
import configuration from './config/configuration';
import {CacheModule} from "@nestjs/cache-manager";
import {RedisOptions} from "./config/redis.options";
import {ScheduleModule} from "@nestjs/schedule";
import { SyncModule } from './sync/sync.module';
import {RateLimitMiddleware} from "./rate-limit/rate-limit.middleware";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    CacheModule.registerAsync(RedisOptions),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${configService.get('database.host')}:${configService.get('database.port')}/${configService.get('database.name')}`
      }),
      inject: [ConfigService]
    }),
    UrlModule,
    SyncModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimitMiddleware)
      .forRoutes("*")
  }
}
