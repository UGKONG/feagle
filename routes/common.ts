import { Router } from "express";
import { getBoardType, getActor, getAuthType } from "../controllers/common";

const commonRouter = Router();

commonRouter
  .get("/boardType", getBoardType)
  .get("/actor", getActor)
  .get("/authType", getAuthType);

export default commonRouter;
