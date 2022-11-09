import { Router } from "express";
import { getNewVersion } from "../controllers/version";

const versionRouter = Router();

versionRouter.get("/", getNewVersion);

export default versionRouter;
