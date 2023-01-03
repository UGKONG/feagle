import { Router } from "express";
import { getFileDownload, postFileUpload } from "../controllers/file";

const fileRouter = Router();

fileRouter.get("/:FILE_SQ", getFileDownload).post("/:POST_SQ", postFileUpload);

export default fileRouter;
