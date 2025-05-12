import express from "express";
import { Login, Register } from "../controller/auth";
import {
  validateLoginInput,
  validateRegisteredUserInput,
} from "../middleware/validationMiddleware";

const Router = express.Router();

Router.post("/register", validateRegisteredUserInput, Register);
Router.post("/login", validateLoginInput, Login);

export default Router;
