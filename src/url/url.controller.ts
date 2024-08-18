import { Controller, Post, Body } from '@nestjs/common';
import {UrlService} from "./url.service";

@Controller('shorten')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  async saveUrl(@Body() dto: {link: string}) {
    const url = await this.urlService.saveUrl(dto.link);
    return {code: url.code};
  }
}
