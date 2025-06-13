import mongoose from "mongoose";

async function ConnectDB(value: string) {
  try {
    const res = await mongoose.connect(value);
    console.log(res.connection.host);
  } catch (error) {
    console.log("Error connecting to database", error);
    process.exit(1);
  }
}

export default ConnectDB;
