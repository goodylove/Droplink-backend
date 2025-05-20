import { StatusCodes } from "http-status-codes";
import crypto from "crypto";
import User from "../model/UserModel";
import Token from "../model/token";
import { comparePassword, hashPassword } from "../utils/hashPassword";
import { BadRequestError, UnauthenticatedError } from "../errors/customsErrors";
import { attachCookieToResponse, createJwt } from "../utils/token";

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
  const user = await User.findOne({ email: req.body.email });

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

  // check for existing token
  const existingToken = await Token.findOne({ user: user._id });

  if (existingToken) {
    if (!existingToken.isValid) {
      throw new UnauthenticatedError("invalid credentials");
    }
    refreshToken = existingToken?.refreshToken;
    attachCookieToResponse({ res, userId: user._id, refreshToken });
    res
      .status(StatusCodes.OK)
      .json({ message: "User loggedIn successfully", userDetails });
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
  // console.log(req.user);
  // await Token.findOneAndUpdate({ user: req.user.userId });
  // res.clearCookie("accessToken");

  res.clearCookie("accessToken", {
    httpOnly: true,

    // signed: true,
    expires: new Date(Date.now()),
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,

    // signed: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).send("User logged out successfully");
};
