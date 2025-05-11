import { StatusCodes } from "http-status-codes";

export const Register = async (req: any, res: any) => {
  res.status(StatusCodes.CREATED).send("User Created");
};
export const Login = async (req: any, res: any) => {
  res.status(StatusCodes.OK).send("User logged in successfully");
};

const logout = async (req: any, res: any) => {
  res.status(StatusCodes.OK).send("User logged out successfully");
};
