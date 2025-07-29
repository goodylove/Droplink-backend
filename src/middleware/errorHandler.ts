import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

function ErrorHandlerMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // console.error("Error occurred:", err);
  const message = err.message || "Internal Server Error";
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    message,
  });
}

export default ErrorHandlerMiddleware;
