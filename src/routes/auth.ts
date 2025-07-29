import express from "express";
import { Login, Logout, RefreshToken, Register } from "../controller/auth";
import {
  validateLoginInput,
  validateRegisteredUserInput,
} from "../middleware/validationMiddleware";
import {
  GoogleCallback,
  RedirectUserToGoogle,
} from "../controller/google.controller";

const Router = express.Router();

Router.post("/register", validateRegisteredUserInput, Register);
Router.post("/login", validateLoginInput, Login);
Router.get("/logout", Logout);
Router.get("/google", RedirectUserToGoogle);
Router.get("/google/callback", GoogleCallback);
Router.post("/refresh-token", RefreshToken);

export default Router;
