import jwt from "jsonwebtoken";
import { UserPayload } from "../types/interface";

export function createJwt(payload: UserPayload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN
      ? parseInt(process.env.JWT_EXPIRES_IN, 10)
      : undefined,
  });
  return token;
}

export function verifyJwt(token: string) {
  const verifyToken = jwt.verify(token, process.env.JWT_SECRET as string);
  return verifyToken;
}
