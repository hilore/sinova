import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseFilters,
} from '@nestjs/common';
import {UrlService} from "./url.service";
import {AllExceptionsFilter} from "../exceptions/AllExceptionsFilter";

@UseFilters(AllExceptionsFilter)
@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Get("/:code")
  async getUrl(@Param("code") code: string) {
    const link = await this.urlService.getUrl(code);
    return {url: link.link};
  }

  @Get("/stats/:code")
  async getUrlClickStats(@Param("code") code: string) {
    const clicks = await this.urlService.getUrlClicks(code);
    return {clicks};
  }

  @Post("/shorten")
  async saveUrl(@Body() dto: {link: string}) {
    const url = await this.urlService.saveUrl(dto.link);
    return {code: url.code};
  }
}
