import { StatusCodes } from "http-status-codes";
import crypto from "crypto";
import User from "../model/UserModel";
import Token from "../model/token";
import { comparePassword, hashPassword } from "../utils/hashPassword";
import {
  BadRequestError,
  UnauthenticatedError,
  UnAuthorized,
} from "../errors/customsErrors";
import { attachCookieToResponse, createJwt } from "../utils/token";
import { addDays } from "date-fns";

// Create a new user
export const Register = async (req: any, res: any) => {
  if (req.body.password !== req.body.confirmPassword) {
    throw new BadRequestError("Password and confirm password do not match");
  }
  const hashUserPassword = await hashPassword(req.body.password);
  req.body.password = hashUserPassword;

  const user = await User.create(req.body);
  res
    .status(StatusCodes.CREATED)
    .json({ message: "User created successfully" });
};

// Login user
export const Login = async (req: any, res: any) => {
  if (!req.body.email || !req.body.password) {
    throw new BadRequestError("All fields are required");
  }

  const user = await User.findOne({ email: req.body.email });

  if (!user) throw new UnauthenticatedError("Invalid credentials");

  if (!user.password && user.googleId) {
    throw new UnauthenticatedError("Please login with Google");
  }

  const userValid =
    user && (await comparePassword(req.body.password, user.password));

  if (!userValid) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const userDetails = {
    name: user.name,
    email: user.email,
    userId: user._id,
  };

  // create refreshToken
  let refreshToken = "";

  const existingToken = await Token.findOne({ user: user._id });

  if (existingToken && existingToken.expiresAt > new Date()) {
    attachCookieToResponse({
      res,
      userId: user._id,
      refreshToken: existingToken.refreshToken,
    });
    res.status(StatusCodes.OK).json({ message: "User loggedIn successfully" });
    return;
  }

  
  // create new token if no existing token

  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const token = await Token.create({
    user: user._id,
    userAgent,
    refreshToken,
    ip,
  });
  attachCookieToResponse({ res, userId: user._id, refreshToken });
  res
    .status(StatusCodes.OK)
    .json({ message: "User loggedIn successfully", userDetails });
};

export const Logout = async (req: any, res: any) => {
  res.clearCookie("accessToken", {
    httpOnly: true,

    expires: new Date(Date.now()),
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,

    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).send("User logged out successfully");
};

export const RefreshToken = async (req: any, res: any) => {
  const oldResfreshToken = req.cookies.refreshToken;

  const existingToken = await Token.findOne({
    refreshToken: oldResfreshToken,
  }).populate("user");

  if (!existingToken || existingToken.expiresAt < new Date()) {
    throw new UnAuthorized("Invalid token");
  }

  await Token.deleteOne({ refreshToken: existingToken.refreshToken });

  const refreshToken = crypto.randomBytes(32).toString("hex");

  await Token.create({
    refreshToken,
    user: existingToken.user._id,
    userAgent: req.headers["user-agent"],
    expiresAt: addDays(new Date(), 7),
  });
  attachCookieToResponse({ res, refreshToken, userId: existingToken.user._id });

  res.status(StatusCodes.OK).json({ message: "New refresh token created " });
};
