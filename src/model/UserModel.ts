import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      unique: true, // Ensure email is unique
    },
    password: String,
    avatar: String,
    googleId: {
      type: String,
      unique: true, // Optional but recommended
    },
  },
  { timestamps: true }
);

UserSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.password; // Exclude password from the output
  return obj;
};

export default mongoose.model("User", UserSchema);
// 71bab82ccd928b379c5c6aad1c5240a2
