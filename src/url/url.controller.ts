import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseFilters,
  UseInterceptors
} from '@nestjs/common';
import {UrlService} from "./url.service";
import {AllExceptionsFilter} from "../exceptions/AllExceptionsFilter";
import {CacheInterceptor} from "@nestjs/cache-manager";

@UseFilters(AllExceptionsFilter)
@UseInterceptors(CacheInterceptor)
@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Get(":code")
  async getUrl(@Param("code") code: string) {
    const link = await this.urlService.getUrl(code);
    return {url: link};
  }

  @Post("shorten")
  async saveUrl(@Body() dto: {link: string}) {
    const url = await this.urlService.saveUrl(dto.link);
    return {code: url.code};
  }
}
