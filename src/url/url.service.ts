import { Injectable } from '@nestjs/common';
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {Url} from "./schemas/url.schema";
import UrlDto from "./dto/url.dto";

@Injectable()
export class UrlService {
  constructor(@InjectModel(Url.name) private model: Model<Url>) {}

  async saveUrl(link: string): Promise<UrlDto> {
    const code = this.generateRandomString();
    const url = new this.model({code, link});
    await url.save();

    return new UrlDto(url);
  }

  // maybe move it to another service?
  generateRandomString(): string {
    return (Math.random()).toString(36).substring(6);
  }
}
