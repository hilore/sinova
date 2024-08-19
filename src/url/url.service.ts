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

  async getUrl(code: string): Promise<UrlDto> {
    const linkCached = await this.cacheManager.get<UrlDto>(code);

    if (linkCached && linkCached.link) {
      linkCached.clicks += 1;
      await this.cacheManager.set(code, {link: linkCached.link, clicks: linkCached.clicks});

      return linkCached;
    }

    const linkDb = await this.model.findOne({code}).exec();

    if (!linkDb) {
      throw new NotFoundException("URL with such code does not exists");
    }

    linkDb.clicks += 1;
    await linkDb.save();

    return new UrlDto(linkDb);
  }

  async getUrlClicks(code: string): Promise<number> {
    const linkCached = await this.cacheManager.get<UrlDto>(code);

    if (linkCached && linkCached.link) {
      return linkCached.clicks;
    }

    const linkDb = await this.model.findOne({code}).exec();

    if (!linkDb) {
      throw new NotFoundException("URL with such code does not exists");
    }

    await linkDb.save();

    return linkDb.clicks;
  }

  async saveUrl(link: string): Promise<UrlDto> {
    const code = this.generateRandomString();
    const url = new this.model({code, link});

    await url.save();
    await this.cacheManager.set(code, {link: url.link, clicks: url.clicks});

    return new UrlDto(url);
  }

  async syncClicksFromCache() {
    const keysCached = await this.cacheManager.store.keys();

    for (const key of keysCached) {
      const linkCached = await this.cacheManager.get<UrlDto>(key);

      if (linkCached) {
        await this.model.updateOne({code: key}, {clicks: linkCached.clicks});
      }
    }
  }

  generateRandomString(): string {
    return (Math.random()).toString(36).substring(6);
  }
}
