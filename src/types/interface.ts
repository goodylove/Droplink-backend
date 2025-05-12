import { Types } from "mongoose";
import Request from "express";

export type UserPayload = {
  userId: Types.ObjectId;
  name: string;
};

export interface CustomRequest extends Request {
  user?: string; // Add the user property to the request object
}
