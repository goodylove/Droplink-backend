import { NextFunction, Request, Response } from "express";
import { UnauthenticatedError, UnAuthorized } from "../errors/customsErrors";
import { verifyJwt } from "../utils/token";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.cookies;

  if (!token) {
    throw new UnAuthorized("You are not authorized to access this resource");
  }
  try {
    const verifyUser = verifyJwt(token);
    if (typeof verifyUser !== "string" && "userId" in verifyUser) {
      req.user = verifyUser.userId;
    } else {
      throw new UnauthenticatedError("Invalid token payload");
    }
    next();
  } catch (error) {
    throw new UnauthenticatedError("authentication Failed");
  }
};
