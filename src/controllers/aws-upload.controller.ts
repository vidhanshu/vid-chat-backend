import { Response } from "express";

import {
  ResponseError,
  ReturnCatchedErrorResponse,
  sendResponse,
} from "../utils/response";
import { s3 } from "../configs/aws";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function Upload(req: any, res: Response) {
  try {
    res.status(200).json({
      message: "File uploaded successfully",
      link: req.file.location,
    });
  } catch (error) {
    ReturnCatchedErrorResponse(res, error);
  }
}

export async function Delete(req: any, res: Response) {
  try {
    const key = req.body.key;
    if (!key) {
      throw new ResponseError("Key is required", 400);
    }

    const command = new DeleteObjectCommand({
      Key: key,
      Bucket: "vid-chat",
    });

    await s3.send(command);

    sendResponse(res, {
      message: "File deleted successfully",
    });
  } catch (error) {
    ReturnCatchedErrorResponse(res, error);
  }
}
