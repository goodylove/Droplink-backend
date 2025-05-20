import { Request } from "express";
import { Types } from "mongoose";

export type UserPayload = {
  userId: Types.ObjectId;

  refreshToken?: string;
};

export interface CustomRequest extends Request {
  user?: string; // Add the user property to the request object
}
