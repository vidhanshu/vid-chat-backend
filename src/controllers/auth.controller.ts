import { Request, Response } from "express";
import validator from "validator";

import User from "../models/user.model";
import { signJWT } from "../utils/jwt";
import { IGetUserAuthInfoRequest } from "../@types/types";
import {
  ResponseError,
  ReturnCatchedErrorResponse,
  sendResponse,
} from "../utils/response";

export async function signUp(req: IGetUserAuthInfoRequest, res: Response) {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password)
      throw new ResponseError("Missing email, password or username", 400);
    if (!validator.isEmail(email))
      throw new ResponseError("Invalid email", 400);
    if (!validator.isStrongPassword(password))
      throw new ResponseError(
        "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 symbol",
        400
      );
    if (!validator.isAlphanumeric(username)) {
      throw new ResponseError("Username must be alphanumeric", 400);
    }

    // if username or email already taken
    if (
      !!(await User.findOne({ email })) ||
      !!(await User.findOne({ username }))
    ) {
      throw new ResponseError("User already exists", 400);
    }

    const newUser = new User({ username, email, password });
    const token = signJWT(newUser._id);
    newUser.access_token = token;

    await newUser.save();
    sendResponse(res, {
      token,
      message: "Successfully sign up",
      statusCode: 201,
    });
  } catch (error: any) {
    ReturnCatchedErrorResponse(res, error);
  }
}

export async function SignIn(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      throw new ResponseError("Missing email or password", 400);
    if (!validator.isEmail(email))
      throw new ResponseError("Invalid email", 400);
    if (!validator.isStrongPassword(password))
      throw new ResponseError(
        "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 symbol",
        400
      );

    const user = await User.findOne({ email });

    if (!user) throw new ResponseError("User does not exist", 404);

    const isMatch = await user.isValidPassword(password);
    if (!isMatch) throw new ResponseError("Invalid password", 400);

    const token = signJWT(user._id);
    user.access_token = token;

    await user.save();
    sendResponse(res, { token, message: "Successfully sign in" });
  } catch (error: any) {
    ReturnCatchedErrorResponse(res, error);
  }
}

export async function SignOut(req: IGetUserAuthInfoRequest, res: Response) {
  try {
    const user = req.user;
    if (!user) throw new ResponseError("Unauthorized", 401);

    await User.findByIdAndUpdate(user._id, { access_token: "" });

    sendResponse(res, { message: "Successfully signed out" });
  } catch (error: any) {
    ReturnCatchedErrorResponse(res, error);
  }
}
