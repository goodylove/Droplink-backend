import mongoose from "mongoose";

const LinkSchema = new mongoose.Schema({
  platform: { type: String, required: true }, // e.g., 'Spotify'
  url: { type: String, required: true },
});

const SocialSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., 'Instagram'
  url: { type: String, required: true },
});

const ProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  avatar: String,
  avatarPublicId: String,

  links: [LinkSchema],
  socials: [SocialSchema],
});

export default mongoose.model("Artist", ProfileSchema);
