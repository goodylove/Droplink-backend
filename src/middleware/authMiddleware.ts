import { NextFunction, Response } from "express";
import { attachCookieToResponse, verifyJwt } from "../utils/token";
import { UnauthenticatedError } from "../errors/customsErrors";
import Token from "../model/token";

async function authMiddleware(req: any, res: Response, next: NextFunction) {
  const { accessToken, refreshToken } = req.cookies;

  try {
    if (accessToken) {
      try {
        const decoded = verifyJwt(accessToken);
        if (
          decoded &&
          typeof decoded !== "string" &&
          decoded.hasOwnProperty("userId")
        ) {
          req.user = decoded.userId;
          return next();
        }
        throw new UnauthenticatedError("Invalid access token");
      } catch (error) {
        if (error.name !== "TokenExpiredError") {
          throw new UnauthenticatedError("Invalid access token");
        }
      }
    }

    if (!refreshToken) {
      throw new UnauthenticatedError("No refresh token provided");
    }

    const storedRefreshToken = await Token.findOne({ refreshToken });

    if (!storedRefreshToken || storedRefreshToken.expiresAt < new Date()) {
      throw new UnauthenticatedError("Invalid refresh token");
    }

    const newAccessToken = attachCookieToResponse({
      res,
      userId: storedRefreshToken.user,
      refreshToken: storedRefreshToken.refreshToken,
    });
    req.user = storedRefreshToken.user;
    next();
  } catch (error) {
    next(error);
  }
}

export default authMiddleware;
