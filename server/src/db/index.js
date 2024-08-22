import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log("DATABASE CONNECTED !!", connectionInstance.connection.host);
  } catch (error) {
    console.log("MONGODB CONNECTION FAILED", error);
  }
};
