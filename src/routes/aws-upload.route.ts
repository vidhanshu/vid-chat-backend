import express from "express";
import multer from "multer";
import multerS3 from "multer-s3";

import { auth } from "../middlewares/auth.middleware";
import { Delete, Upload } from "../controllers/aws-upload.controller";
import { s3 } from "../configs/aws";

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "vid-chat",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
});

const uploadRouter = express.Router();

uploadRouter.post("/upload", auth, upload.single("image"), Upload);
uploadRouter.delete("/delete", auth, Delete);

export default uploadRouter;