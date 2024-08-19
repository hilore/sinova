import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import * as mg from "mongoose";

export type UrlDocument = mg.HydratedDocument<Url>;

@Schema()
export class Url {
  @Prop({required: true})
  link: string;

  @Prop({required: true})
  code: string;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
