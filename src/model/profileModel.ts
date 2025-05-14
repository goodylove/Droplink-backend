import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },

  links: [{ platform: "spotify", url: String }],
  socials: [{ name: "instagram", url: String }],
});
