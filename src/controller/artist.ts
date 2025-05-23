import { Request, Response } from "express";
import { CustomRequest } from "../types/interface";
import Artist from "../model/artistModel";
import { StatusCodes } from "http-status-codes";

export async function getAllArtist(req: Request, res: Response) {
  const artists = await Artist.find();
  res.status(StatusCodes.OK).json({
    message: "All artists retrieved successfully",
    data: artists,
    count: artists.length,
  });
}
// TODO: Implement image upload functionality
export async function createArtist(req: CustomRequest, res: Response) {
  req.body.userId = req.user;
  const artist = await Artist.create(req.body);
  res.status(StatusCodes.OK).json({
    message: "Artist created successfully",
    data: artist,
  });
}

export async function updateArtist(req: Request, res: Response) {
  const { id } = req.params;

  const updateArtistData = await Artist.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res
    .status(StatusCodes.OK)
    .json({ message: "Updated artist data", data: updateArtistData });
}

export async function getArtistById(req: Request, res: Response) {
  const { id } = req.params;
  const artist = await Artist.findById(id);
  res
    .status(StatusCodes.OK)
    .json({ message: "Artist retrieved successfully", data: artist });
}
