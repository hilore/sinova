import { Module } from '@nestjs/common';
import { UrlService } from './url.service';

@Module({
  providers: [UrlService]
})
export class UrlModule {}
