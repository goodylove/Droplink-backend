import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  avatar: String,
  avatarPublicId: String,

  links: [{ platform: String, url: String }],
  socials: [{ name: String, url: String }],
});
