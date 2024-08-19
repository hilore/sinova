import {UrlDocument} from "../schemas/url.schema";

class UrlDto {
  id: string;
  code: string;
  link: string;
  clicks: number;

  constructor(url: UrlDocument) {
    this.id = url.id;
    this.code = url.code;
    this.link = url.link;
    this.clicks = url.clicks;
  }
}

export default UrlDto;
