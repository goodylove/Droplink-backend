import { StatusCodes } from "http-status-codes";
import User from "../model/UserModel";
import { comparePassword, hashPassword } from "../utils/hashPassword";
import { BadRequestError, UnauthenticatedError } from "../errors/customsErrors";
import { createJwt } from "../utils/token";

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

  const UserPayload = {
    userId: user._id,
    name: user.name,
  };

  const token = createJwt(UserPayload);
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + oneDay * 5),
  });

  res.status(StatusCodes.OK).json({ message: "User logged in successfully" });
};

const logout = async (req: any, res: any) => {
  res.status(StatusCodes.OK).send("User logged out successfully");
};
