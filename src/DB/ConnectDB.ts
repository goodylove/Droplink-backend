import mongoose from "mongoose";

async function ConnectDB(value: string) {
  try {
    await mongoose.connect(value);
  } catch (error) {
    console.log("Error connecting to database", error);
    process.exit(1);
  }
}

export default ConnectDB;
