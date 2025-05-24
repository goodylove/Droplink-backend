import { Request } from "express";
import { Types } from "mongoose";

export type UserPayload = {
  userId: Types.ObjectId;

  refreshToken?: string;
};

export interface CustomRequest extends Request {
  user?: string;
  file?: Express.Multer.File;
}
