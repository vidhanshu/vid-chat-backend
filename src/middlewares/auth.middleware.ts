import { Request, Response, NextFunction, raw } from "express";
import { verifyJWT } from "../utils/jwt";
import User from "../models/user.model";
import { IGetUserAuthInfoRequest } from "../@types/types";

export async function auth(
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const rawToken = req.header("Authorization");
    const token = rawToken?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Access denied" });

    const { _id } = verifyJWT(token);
    if (!_id) return res.status(401).json({ error: "Access denied" });

    const user = await User.findOne({
      _id,
      access_token: token,
    });
    if (!user) return res.status(401).json({ error: "Access denied" });

    let rawUser: any = user.toObject();
    delete rawUser.password;
    delete rawUser.access_token;

    req.user = user;

    next();
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
