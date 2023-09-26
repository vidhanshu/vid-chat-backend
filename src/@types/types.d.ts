import { Request } from "express";
import { Document, Types } from "mongoose";
import { IUser } from "../models/types";

export interface IGetUserAuthInfoRequest extends Request {
  user?: Document<unknown, {}, IUser> &
    IUser & {
      _id: Types.ObjectId;
    };
}
