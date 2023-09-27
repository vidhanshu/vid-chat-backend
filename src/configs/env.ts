import dotenv from "dotenv";

// dotenv configs
dotenv.config();

export const PORT = process.env.PORT || 8000;
export const DB_URL = process.env.DB_URL || "mongodb://localhost:27017";
export const JWT_SECRET = process.env.JWT_SECRET || "TOP_SECRET";
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || "";
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || "";
