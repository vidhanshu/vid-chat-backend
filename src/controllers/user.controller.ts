import { Request, Response } from "express";
import { IGetUserAuthInfoRequest } from "../@types/types";

export async function MyProfile(req: IGetUserAuthInfoRequest, res: Response) {
  res.status(200).json({ data: req.user });
}
