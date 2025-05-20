import express from "express";
import { Login, Logout, Register } from "../controller/auth";
import {
  validateLoginInput,
  validateRegisteredUserInput,
} from "../middleware/validationMiddleware";

const Router = express.Router();

Router.post("/register", validateRegisteredUserInput, Register);
Router.post("/login", validateLoginInput, Login);
Router.get("/logout", Logout);

export default Router;
