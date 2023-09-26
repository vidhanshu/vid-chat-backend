import { Request, Response } from "express";
import validator from "validator";

import User from "../models/user.model";
import { signJWT } from "../utils/jwt";
import { IGetUserAuthInfoRequest } from "../@types/types";

export async function signUp(req: IGetUserAuthInfoRequest, res: Response) {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res
      .status(400)
      .json({ error: "Missing email, password or username" });
  if (!validator.isEmail(email))
    return res.status(400).json({ error: "Invalid email" });
  if (!validator.isStrongPassword(password))
    return res.status(400).json({
      error:
        "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 symbol",
    });
  if (!validator.isAlphanumeric(username)) {
    return res.status(400).json({
      error: "Username must be alphanumeric",
    });
  }

  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res
        .status(400)
        .json({ error: "User already exists with this email" });
    }

    const newUser = new User({ username, email, password });
    const token = signJWT(newUser._id);
    newUser.access_token = token;

    await newUser.save();
    return res.status(201).json({ token });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function SignIn(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).send("Missing email or password");
  if (!validator.isEmail(email)) return res.status(400).send("Invalid email");
  if (!validator.isStrongPassword(password))
    return res
      .status(400)
      .send(
        "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 symbol"
      );

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(401).send("User does not exist");

    const isMatch = await user.isValidPassword(password);
    if (!isMatch) return res.status(401).send("Invalid credentials");

    const token = signJWT(user._id);
    user.access_token = token;

    await user.save();
    return res.status(200).json({ token });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function SignOut(req: IGetUserAuthInfoRequest, res: Response) {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    await User.findByIdAndUpdate(user._id, { access_token: "" });
    res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong!" });
  }
}
