import { Router } from "express";
import { postFileDownload } from "../controllers/file";

const fileRouter = Router();

fileRouter.get("/:FILE_SQ", postFileDownload);

export default fileRouter;
