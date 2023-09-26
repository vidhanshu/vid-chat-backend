import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../configs/env";
import mongoose from "mongoose";

export const signJWT = (_id: mongoose.Types.ObjectId) =>
  jwt.sign({ _id }, JWT_SECRET, { expiresIn: "15d" });

export const verifyJWT = (token: string): { _id: string } =>
  jwt.verify(token, JWT_SECRET) as { _id: string };
