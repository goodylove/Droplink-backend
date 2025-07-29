import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    expiresAt: Date
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Token", TokenSchema);
