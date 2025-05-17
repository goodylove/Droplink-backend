import express from "express";
import { Login, Register } from "../controller/auth";
import {
  createArtist,
  getAllArtist,
  getArtistById,
  updateArtist,
} from "../controller/artist";
import { validateArtistInputs } from "../middleware/validationMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";

const Router = express.Router();

Router.route("/")
  .get(getAllArtist)
  .post(validateArtistInputs, authMiddleware, createArtist);
Router.route("/:id").get(getArtistById).patch(updateArtist);
export default Router;
