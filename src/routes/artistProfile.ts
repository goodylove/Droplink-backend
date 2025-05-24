import express from "express";
import { Login, Register } from "../controller/auth";
import {
  createArtist,
  getAllArtist,
  getArtistById,
  getCurrentArtist,
  updateArtist,
  UploadArtistImage,
} from "../controller/artistProfile";
import { validateArtistInputs } from "../middleware/validationMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";
import multerUpload from "../middleware/multerValidation";

const Router = express.Router();

Router.route("/")
  .get(getAllArtist)
  .post(authMiddleware, validateArtistInputs, createArtist);

Router.route("/uploadImage").post(
  authMiddleware,
  multerUpload.single("avatar"),
  UploadArtistImage
);

Router.route("/current-user").get(authMiddleware, getCurrentArtist);

Router.route("/:id").get(getArtistById).patch(updateArtist);
export default Router;
