import { Router } from "express";
import { getFileDownload } from "../controllers/file";

const fileRouter = Router();

fileRouter.get("/:FILE_SQ", getFileDownload);

export default fileRouter;
