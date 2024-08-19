import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {Url} from "./schemas/url.schema";
import UrlDto from "./dto/url.dto";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {Cache} from "cache-manager";

@Injectable()
export class UrlService {
  constructor(
    @InjectModel(Url.name) private model: Model<Url>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async getUrl(code: string): Promise<string> {
    const linkCached = await this.cacheManager.get<string>(code);
    if (linkCached != null) {
      return linkCached;
    }

    const linkDb = await this.model.findOne({code}).exec();
    if (!linkDb) {
      throw new NotFoundException("URL with such code does not exists");
    }

    return linkDb.link;
  }

  async saveUrl(link: string): Promise<UrlDto> {
    const code = this.generateRandomString();
    const url = new this.model({code, link});

    await this.cacheManager.set(code, link);
    await url.save();

    return new UrlDto(url);
  }

  // maybe move it to another service?
  generateRandomString(): string {
    return (Math.random()).toString(36).substring(6);
  }
}
