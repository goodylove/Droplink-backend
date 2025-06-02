import jwt from "jsonwebtoken";
import { UserPayload } from "../types/interface";
import { Response } from "express";

export function createJwt(payload: UserPayload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string);
  return token;
}

export function attachCookieToResponse({
  res,
  refreshToken,
  userId,
}: {
  res: Response;

  userId: any;
  refreshToken?: string;
}) {
  const accessToken = createJwt({ userId });
  const refreshTokenJwt = createJwt({ userId, refreshToken });

  const oneDay = 1000 * 60 * 60 * 24;
  const longExp = 1000 * 60 * 60 * 24 * 30;

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    secure: true,
    expires: new Date(Date.now() + oneDay * 3),
    sameSite: "none",
  });

  res.cookie("refreshToken", refreshTokenJwt, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    secure: true,
    expires: new Date(Date.now() + longExp),
    sameSite: "none",
  });
}

export function verifyJwt(token: any) {
  const verifyToken = jwt.verify(token, process.env.JWT_SECRET as string);
  return verifyToken;
}
