import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import {UrlModule} from "../url/url.module";

@Module({
  imports: [UrlModule],
  providers: [SyncService],
  exports: [SyncService]
})
export class SyncModule {}
