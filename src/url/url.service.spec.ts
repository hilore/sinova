import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import {getModelToken} from "@nestjs/mongoose";
import {Cache} from "cache-manager";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {NotFoundException} from "@nestjs/common";
import {Model} from "mongoose";
import {Url} from "./schemas/url.schema";
import UrlDto from "./dto/url.dto";

describe('UrlService', () => {
  let service: UrlService;
  let model: Model<Url>;
  let cacheManager: Cache

  const mockModel = {
    findOne: jest.fn(),
    updateOne: jest.fn(),
    save: jest.fn()
  };

  const mockCacheMgr = {
    get: jest.fn(),
    set: jest.fn(),
    store: {keys: jest.fn()},
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: getModelToken(Url.name),
          useValue: mockModel
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheMgr
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
    model = module.get<Model<Url>>(getModelToken(Url.name));
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  describe("getUrl", () => {
    it("should return a cached URL if it exists", async () => {
      const code = "Q4jK3e";
      const linkCached: {link: string, clicks: number} = {link: "https://example.com", clicks: 4};

      jest.spyOn(cacheManager, "get").mockResolvedValueOnce(linkCached);
      jest.spyOn(cacheManager, "set").mockResolvedValueOnce(undefined);

      const result = await service.getUrl(code);

      expect(cacheManager.get).toHaveBeenCalledWith(code);
      expect(cacheManager.set).toHaveBeenCalledWith(code, {...linkCached});
      expect(result).toEqual({...linkCached});
    });

    it("should return URL from DB if not cached and then cache it", async () => {
      const code = "Q4jK3e";
      const linkDb = {link: "https://example.com", clicks: 4, save: jest.fn()};

      jest.spyOn(cacheManager, "get").mockResolvedValueOnce(null);
      jest.spyOn(model, "findOne").mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(linkDb)
      } as any);
      jest.spyOn(cacheManager, "set").mockResolvedValueOnce(undefined);

      const result = await service.getUrl(code);

      expect(cacheManager.get).toHaveBeenCalledWith(code);
      expect(model.findOne).toHaveBeenCalledWith({code});
      expect(cacheManager.set).toHaveBeenCalledWith(code, {
        link: linkDb.link,
        clicks: linkDb.clicks
      });
      expect(result).toBeInstanceOf(UrlDto);
      expect(result.link).toEqual(linkDb.link);
      expect(result.clicks).toEqual(linkDb.clicks);
    });

    it("should throw NotFoundException if URL not found in DB", async () => {
      const code = "Q4jK3e";
      
      jest.spyOn(cacheManager, "get").mockResolvedValueOnce(null);
      jest.spyOn(model, "findOne").mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null)
      } as any);

      await expect(service.getUrlClicks(code)).rejects.toThrow(NotFoundException);
    });
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
