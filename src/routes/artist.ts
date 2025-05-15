import express from "express";
import { Login, Register } from "../controller/auth";
import {
  createArtist,
  getAllArtist,
  getArtistById,
  updateArtist,
} from "../controller/artist";

const Router = express.Router();

Router.route("/").get(getAllArtist).post(createArtist);
Router.route("/:id").get(getArtistById).patch(updateArtist);
