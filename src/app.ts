import "express-async-errors";

import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import { StatusCodes } from "http-status-codes";
import morgan from "morgan";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

import authRouter from "./routes/auth";
import artistRouter from "./routes/artistProfile";
import ErrorHandlerMiddleware from "./middleware/errorHandler";
import ConnectDB from "./DB/ConnectDB";
import { authMiddleware } from "./middleware/authMiddleware";

const PORT = process.env.PORT || 8000;
const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME!,
  api_key: process.env.CLOUD_API_KEY!,
  api_secret: process.env.CLOUD_API_SECRET!,
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
// Middleware
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});
app.get("/", (req, res) => {
  res.status(StatusCodes.OK).send("Welcome to the Music App API");
});
// Routes

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/artist", authMiddleware, artistRouter);

app.use("*", (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ message: "Route does not exist" });
});

app.use(ErrorHandlerMiddleware);

const start = async () => {
  await ConnectDB(process.env.MONGO_URI as string);
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};

start();
