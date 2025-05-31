import { NextFunction, Request, Response } from "express";
import { UnauthenticatedError, UnAuthorized } from "../errors/customsErrors";
import { attachCookieToResponse, verifyJwt } from "../utils/token";
import { CustomRequest } from "../types/interface";
import Token from "../model/token";

export const authMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken, accessToken } = req.cookies;
  // console.log(refreshToken);

  try {
    if (accessToken) {
      const verifyUser = verifyJwt(accessToken);
      if (typeof verifyUser !== "string" && "userId" in verifyUser) {
        req.user = verifyUser.userId;
        return next();
      } else {
        throw new UnauthenticatedError("Invalid token payload");
      }
    }

    if (!refreshToken) {
      throw new UnAuthorized("No refreshToken provided");
    }
    const payload = verifyJwt(refreshToken);

    if (
      typeof payload !== "string" &&
      "userId" in payload &&
      "refreshToken" in payload
    ) {
      const existingToken = await Token.findOne({
        user: payload.userId,
        refreshToken: payload.refreshToken,
      });

      if (!existingToken || !existingToken.isValid) {
        throw new UnAuthorized("Invalid refresh token");
      }

      attachCookieToResponse({
        res,
        userId: payload.userId,
        refreshToken: existingToken.refreshToken,
      });

      req.user = payload.userId;
      next();
    } else {
      throw new UnauthenticatedError("Invalid token payload");
    }
  } catch (error) {
    console.log(error);
    throw new UnauthenticatedError("authentication Failed");
  }
};
