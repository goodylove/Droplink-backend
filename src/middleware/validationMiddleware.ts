import { NextFunction, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";

import User from "../model/UserModel";
import Artist from "../model/artistModel";

import { BadRequestError } from "../errors/customsErrors";

const withValidationError = (validations: any[]) => {
  return [
    ...validations,
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        const errMsg = errorMessages.toString();

        throw new BadRequestError(errMsg);
      }
      next();
    },
  ];
};

export const validateLoginInput = withValidationError([
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email"),
  body("password").notEmpty().withMessage("password is required"),
]);

export const validateRegisteredUserInput = withValidationError([
  body("name").notEmpty().withMessage("name is required"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new BadRequestError("email already exist");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least  8 character long"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("confirmPassword is required")
    .isLength({ min: 8 })
    .withMessage("confirmPassword must be at least  8 character long"),
]);

export const validateArtistInputs = withValidationError([
  body("title")
    .notEmpty()
    .withMessage("title is required")
    .isLength({ min: 3 }),
  body("bio").notEmpty().withMessage("boi is required"),
  body("username")
    .notEmpty()
    .withMessage("username is required")
    .custom(async (username) => {
      const artist = await Artist.findOne({ username });
      if (artist) {
        throw new BadRequestError("username already exist");
      }
    }),
  body("links")
    .isArray({ min: 1 })
    .withMessage("links is required and should be an array"),
  body("links.*.platform").notEmpty().withMessage("platform  is required"),
  body("links.*.link")
    .notEmpty()
    .withMessage("link is required")
    .isURL()
    .withMessage("link is not valid"),
  body("socials")
    .isArray({ min: 1 })
    .withMessage("social is required and should be an array"),
  body("socials.*.name").notEmpty().withMessage("the name is required"),
  body("socials.*.link")
    .notEmpty()
    .withMessage("link is required")
    .isURL()
    .withMessage("link is not valid"),
]);
