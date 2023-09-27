/**
 * [RESPONSE PATTERN]
 * return response will contain a json which may have 4 fields: data, error, message, token
 */

import { Response } from "express";

export class ResponseError extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const ReturnCatchedErrorResponse = (res: Response, error: any) => {
  if (error instanceof ResponseError) {
    return res.status(error.statusCode).json({ error: error.message });
  }
  res.status(500).json({ error: error.message });
};

type ResponsePayload = {
  data?: any;
  error?: string;
  message?: string;
  token?: string;
  statusCode?: number;
};
/**
 *
 * @param res Response object
 * @param object ResponsePayload {data?: any, error?: string, message?: string, token?: string, statusCode?: number}
 */
export const sendResponse = (
  res: Response,
  { data, error, message, token, statusCode = 200 }: ResponsePayload
) => {
  res.status(statusCode).json({
    data: data || null,
    error: error || null,
    message: message || null,
    token,
  });
};
