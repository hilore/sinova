import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {ApiTags, ApiOperation, ApiResponse} from "@nestjs/swagger";

@ApiTags("ping")
@Controller("/ping")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({summary: "Pings server"})
  @ApiResponse({
    status: 200,
    description: "The server responds to the ping"
  })
  @ApiResponse({
    status: 429,
    description: "Rate limit exceeded"
  })
  @ApiResponse({
    status: 500,
    description: "Internal Server Error"
  })
  getPong(): string {
    return this.appService.getPong();
  }
}
