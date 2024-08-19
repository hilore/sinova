import {UrlDocument} from "../schemas/url.schema";

class UrlDto {
  id: string;
  code: string;
  link: string;

  constructor(url: UrlDocument) {
    this.id = url.id;
    this.code = url.code;
    this.link = url.link;
  }
}

export default UrlDto;
