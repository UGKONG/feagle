import { Router } from "express";
import { postFileDownload } from "../controllers/file";

const fileRouter = Router();

fileRouter.post("/:fileSq", postFileDownload);

export default fileRouter;
