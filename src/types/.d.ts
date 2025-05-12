import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: string; // Add the user property to the Request interface
  }
}
