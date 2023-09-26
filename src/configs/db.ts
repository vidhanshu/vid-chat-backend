import mongoose from "mongoose";
import { DB_URL } from "./env";

export const connectDB = async () => {
  mongoose
    .connect(DB_URL)
    .then(() => {
      console.log("DB connected");
    })
    .catch((err: any) => {
      console.log(err.message);
    });
};
