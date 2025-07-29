import axios from "axios";
import { Request, Response } from "express";
import User from "../model/UserModel";
import jwt from "jsonwebtoken";
import qs from "qs";

export const RedirectUserToGoogle = async (req: Request, res: Response) => {
  const redirectUrl = `https://accounts.google.com/o/oauth2/auth`;

  const options = {
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_CALLBACK_URL,
    response_type: "code",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "),
    access_type: "offline",
    prompt: "consent",
  };

  const queryString = new URLSearchParams(options);
  res.redirect(`${redirectUrl}?${queryString.toString()}`);
};

export const GoogleCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  console.log("Google callback code:", req.query.code);

  if (!code) {
    res.status(400).send("No code provided");
    return;
  }

  const { data } = await axios.post(
    "https://oauth2.googleapis.com/token",
    qs.stringify({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_CALLBACK_URL,
      grant_type: "authorization_code",
    }),

    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const { access_token } = data;

  const userInfoResponse = await axios.get(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  const { email, name, id } = userInfoResponse.data;
  console.log("User info from Google:", userInfoResponse.data);

  let user = await User.findOne({ googleId: id });

  if (!user) {
    user = await User.findOne({ email });
    if (user) {
      user.googleId = id;
      await user.save();
    } else if (!user) {
      user = await User.create({
        name,
        email,
        googleId: id,
      });
    }
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "2d",
  });
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 2 * 24 * 60 * 60 * 1000,
    sameSite: "lax",
  });

  res.redirect(`${process.env.FRONTEND_URL}/artist`);
};
