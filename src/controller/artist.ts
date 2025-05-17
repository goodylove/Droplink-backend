import { Request, Response } from "express";
import { CustomRequest } from "../types/interface";

export async function getAllArtist(req: Request, res: Response) {
  res.status(200).send("Retrieved all artists data");
}

export async function createArtist(req: CustomRequest, res: Response) {
  console.log(req.user);
  res.status(200).send("Created artist data");
}

export async function updateArtist(req: Request, res: Response) {
  res.status(200).send("Updated artist data");
}

export async function getArtistById(req: Request, res: Response) {
  res.status(200).send("Retrieved artist data by ID");
}
