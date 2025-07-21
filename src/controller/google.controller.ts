import axios from "axios";
import { Request, Response } from "express";
import User from "../model/UserModel";
import jwt from "jsonwebtoken";

export const RedirectUserToGoogle = async (req: Request, res: Response) => {
  const redirectUrl = `https://accounts.google.com/o/oauth2/auth`;

  const options = {
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_CALLBACK_URL,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    response_type: "code",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      " https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "),
    access_type: "offline",
    prompt: "consent",
  };

  const queryString = new URLSearchParams(options);
  res.redirect(`${redirectUrl}?${queryString.toString()}`);
};

export const GoogleCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;

  if (!code) {
    return res.status(400).send("No code provided");
  }

  //   exchange the code for an access token

  const { data } = await axios.post("https://oauth2.googleapis.com/token", {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_CALLBACK_URL,
    grant_type: "authorization_code",
  });

  const { access_token } = data;

  //   use the access token to get user info
  const userInfoResponse = await axios.get(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  const { email, name, sub } = userInfoResponse.data;

  // Here you would typically find or create a user in your database

  let user = await User.findOne({ googleId: sub });

  if (!user) {
    // Create a new user if not found
    user = await User.create({
      name,
      email,
      googleId: sub,
    });
  }

  // Generate JWT and send as cookie
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  // Redirect to frontend
  res.redirect(`${process.env.FRONTEND_URL}`);
};
