import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async() => {
  try {
    if(!process.env.DATABASE_URL) {

      throw new Error("DATABASE_URL is not defined");
    }

    mongoose.connect(process.env.DATABASE_URL);

    console.log("Database connection succesfully");
  } catch (error) {

    console.error("Database connection failed,"+error);
    process.exit(1);
  }
};

