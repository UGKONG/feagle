import multer from "multer";
import { Router } from "express";
import { getFileDownload, postFileUpload } from "../controllers/file";

const fileRouter = Router();
const upload = multer({ dest: __dirname + "/../upload/" });

fileRouter
  .get("/:FILE_SQ", getFileDownload)
  .post("/", upload?.single("FILE"), postFileUpload);

export default fileRouter;
