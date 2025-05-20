import { Request, Response } from "express";
import { CustomRequest } from "../types/interface";
import Artist from "../model/artistModel";

export async function getAllArtist(req: Request, res: Response) {
  res.status(200).send("Retrieved all artists data");
}

export async function createArtist(req: CustomRequest, res: Response) {
  req.body.userId = req.user;
  const artist = await Artist.create(req.body);
  res.status(200).json({
    message: "Artist created successfully",
    data: artist,
  });
}

export async function updateArtist(req: Request, res: Response) {
  res.status(200).send("Updated artist data");
}

export async function getArtistById(req: Request, res: Response) {
  res.status(200).send("Retrieved artist data by ID");
}
