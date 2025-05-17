import "express-async-errors";

import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routes/auth";
import artistRouter from "./routes/artist";

import { StatusCodes } from "http-status-codes";
import ErrorHandlerMiddleware from "./middleware/errorHandler";
import ConnectDB from "./DB/ConnectDB";

const PORT = process.env.PORT || 8000;
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/artist", artistRouter);

app.use("*", (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ message: "Route does not exist" });
});

app.use(ErrorHandlerMiddleware);

const start = async () => {
  await ConnectDB(process.env.MONGO_URI as string);
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};

start();
