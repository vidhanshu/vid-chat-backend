import { Response } from "express";
import validator from "validator";

import User from "../models/user.model";

import {
  ResponseError,
  ReturnCatchedErrorResponse,
  sendResponse,
} from "../utils/response";

import { IGetUserAuthInfoRequest } from "../@types/types";

export async function MyProfile(req: IGetUserAuthInfoRequest, res: Response) {
  res.status(200).json({ data: req.user });
}

export async function SearchUser(req: IGetUserAuthInfoRequest, res: Response) {
  try {
    const { key } = req.query;
    if (!key) throw new ResponseError("Key is required", 400);

    const users = await User.find({
      $or: [
        { username: { $regex: key.toString(), $options: "i" } },
        { email: { $regex: key.toString(), $options: "i" } },
      ],
      $nor: [{ _id: req.user?._id }],
    }).limit(10);

    res.status(200).json({
      data: users,
    });
  } catch (error: any) {
    ReturnCatchedErrorResponse(res, error);
  }
}

export async function UpdateUser(req: IGetUserAuthInfoRequest, res: Response) {
  try {
    const { email, password, username } = req.body;
    const id = req.user?._id;
    if (!id) throw new ResponseError("User not found", 404);
    if (!email && !password && !username)
      throw new ResponseError("Nothing to update", 400);

    let isEmailUpdated = false;
    let isUsernameUpdated = false;
    let isPasswordUpdae = false;

    // Email
    if (email) {
      const existing = await User.findOne({ email });
      if (!validator.isEmail(email))
        throw new ResponseError("Email is not valid", 400);
      if (existing) throw new ResponseError("Email already exists", 400);
      await User.findByIdAndUpdate(id, { email }, { new: true });
      isEmailUpdated = true;
    }
    // Username
    if (username) {
      const existing = await User.findOne({ username });
      if (existing) throw new ResponseError("Username taken", 400);
      await User.findByIdAndUpdate(id, { username }, { new: true });
      isUsernameUpdated = true;
    }
    // Password
    if (password) {
      if (!validator.isStrongPassword(password)) {
        throw new ResponseError("Password is not strong enough", 400);
      }
      const user = await User.findById(id);
      if (!user) throw new ResponseError("User not found", 404);
      user.password = password;
      await user.save();
      isPasswordUpdae = true;
    }
    const message = `Updated ${isEmailUpdated ? "email " : ""}${
      isUsernameUpdated ? "username " : ""
    }${isPasswordUpdae ? "password " : ""}`;

    const updatedUser = await User.findById(id);
    sendResponse(res, { message, data: updatedUser });
  } catch (error) {
    ReturnCatchedErrorResponse(res, error);
  }
}
