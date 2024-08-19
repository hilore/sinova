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
import {ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse} from "@nestjs/swagger";

@ApiTags("")
@UseFilters(AllExceptionsFilter)
@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Get("/:code")
  @ApiOperation({summary: "Get URL link by its short code"})
  @ApiParam({
    name: "code",
    required: true,
    type: String,
    description: "Shortened URL code"
  })
  @ApiResponse({
    status: 200,
    description: "The URL have been successfully retrieved"
  })
  @ApiResponse({
    status: 404,
    description: "The URL with given code does not exists"
  })
  @ApiResponse({
    status: 429,
    description: "Rate limit exceeded"
  })
  @ApiResponse({
    status: 500,
    description: "Internal Server Error"
  })
  async getUrl(@Param("code") code: string) {
    const link = await this.urlService.getUrl(code);
    return {url: link.link};
  }

  @Get("/stats/:code")
  @ApiOperation({summary: "Get URL statistics by its short code"})
  @ApiParam({
    name: "code",
    required: true,
    type: String,
    description: "Shortened URL code"
  })
  @ApiResponse({
    status: 200,
    description: "The URL statistics have been successfully retrieved"
  })
  @ApiResponse({
    status: 404,
    description: "The URL with given code does not exists"
  })
  @ApiResponse({
    status: 429,
    description: "Rate limit exceeded"
  })
  @ApiResponse({
    status: 500,
    description: "Internal Server Error"
  })
  async getUrlClickStats(@Param("code") code: string) {
    const clicks = await this.urlService.getUrlClicks(code);
    return {clicks};
  }

  @Post("/shorten")
  @ApiOperation({summary: "Shorten the URL link"})
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        link: {type: "string", example: "https://google.com"}
      },
      required: ["link"]
    },
    description: "The URL link to be shortened"
  })
  @ApiResponse({
    status: 200,
    description: "The URL have been successfully shortened"
  })
  @ApiResponse({
    status: 429,
    description: "Rate limit exceeded"
  })
  @ApiResponse({
    status: 500,
    description: "Internal Server Error"
  })
  async saveUrl(@Body() dto: {link: string}) {
    const url = await this.urlService.saveUrl(dto.link);
    return {code: url.code};
  }
}
