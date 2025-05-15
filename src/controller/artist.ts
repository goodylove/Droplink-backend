import { Request, Response } from "express";

export async function getAllArtist(req: Request, res: Response) {
  res.status(200).send("Retrieved all artists data");
}

export async function createArtist(req: Request, res: Response) {
  res.status(200).send("Retrieved all artists data");
}

export async function updateArtist(req: Request, res: Response) {
  res.status(200).send("Retrieved all artists data");
}

export async function getArtistById(req: Request, res: Response) {
  res.status(200).send("Retrieved all artists data");
}
