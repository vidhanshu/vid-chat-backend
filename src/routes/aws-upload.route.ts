import express from "express";
import multer, { MulterError } from "multer";
import multerS3 from "multer-s3";

import { auth } from "../middlewares/auth.middleware";
import { Delete, Upload } from "../controllers/aws-upload.controller";
import { s3 } from "../configs/aws";
import { ResponseError, ReturnCatchedErrorResponse } from "../utils/response";

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "vid-chat",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: function (req, file, cb) {
      console.log("[FILE_UPLOAD_REQUEST_RECEIVED]", file);
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
  limits: {
    fileSize: 3 * 1024 * 1024, // we are allowing only 3 MB files
    files: 1,
  },
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype !== "image/jpeg" &&
      file.mimetype !== "image/png" &&
      file.mimetype !== "image/jpg" &&
      file.mimetype !== "image/gif" &&
      file.mimetype !== "application/pdf"
    ) {
      return cb(
        new ResponseError(
          "File type is not supported. Only jpeg, png, jpg, gif and pdf are supported",
          403
        )
      );
    }
    cb(null, true);
  },
});

const uploadRouter = express.Router();

uploadRouter.post("/upload", auth, function (req, res) {
  upload.single("file")(req, res, function (err) {
    if (err) {
      if (err instanceof MulterError && err.code === "LIMIT_FILE_SIZE") {
        return ReturnCatchedErrorResponse(
          res,
          new ResponseError(
            "File size is too large. Allowed file size is 3MB",
            403
          )
        );
      }
      return ReturnCatchedErrorResponse(res, err);
    }
    Upload(req, res);
  });
});

uploadRouter.delete("/delete", auth, Delete);

export default uploadRouter;
