import { Request, Response } from "express";
import { CustomRequest } from "../types/interface";
import Artist from "../model/artistModel";
import { StatusCodes } from "http-status-codes";
import { formateImage } from "../middleware/multerValidation";
import cloudinary from "cloudinary";
import { BadRequestError } from "../errors/customsErrors";
import User from "../model/UserModel";
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
  const PublicLink = `  http://localhost:3000/artist/${artist.username}`;
  res.status(StatusCodes.OK).json({
    message: "Artist created successfully",
    data: artist,
    PublicLink,
  });
}

export async function UploadArtistImage(
  req: CustomRequest,
  res: Response
): Promise<void> {
  // Check if the user is authenticated
  console.log("User ID:", req.user);
  const artist = await Artist.findOne({ userId: req.user });

  if (!artist) {
    throw new BadRequestError("Artist not found");
  }

  if (!req.file) {
    throw new BadRequestError("Artist image is required");
  }
  // If a file is uploaded, format and upload it to Cloudinary

  const file = formateImage(req.file);
  const response = await cloudinary.v2.uploader.upload(file);
  artist.avatar = response.secure_url;
  artist.avatarPublicId = response.public_id;
  await artist.save();

  const artistFileData = {
    avatar: response.secure_url,
    avatarPublicId: response.public_id,
  };

  res.status(StatusCodes.OK).json({
    message: "Artist image uploaded successfully",
    artistFileData,
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

export async function getCurrentArtist(req: CustomRequest, res: Response) {
  const artist = await User.findOne({ _id: req.user });
  const removePassword = artist?.toJSON();

  res.status(StatusCodes.OK).json({
    message: "Current artist retrieved successfully",
    data: removePassword,
  });
}

export async function getArtistByUsername(req: CustomRequest, res: Response) {
  console.log(req.params.username);
  const artist = await Artist.findOne({ username: req.params.username });

  if (!artist) {
    throw new BadRequestError("Artist not found");
  }

  res.status(StatusCodes.OK).json({
    message: "Current artist retrieved successfully",
    artist,
  });
}
