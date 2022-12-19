import { Router } from "express";
import {
  getBoardType,
  getActor,
  getAuthType,
  getSession,
  getLogout,
  getProgramMode,
  getDataTypeList,
} from "../controllers/common";

const commonRouter = Router();

commonRouter
  .get("/boardType", getBoardType)
  .get("/dataType", getDataTypeList)
  .get("/actor", getActor)
  .get("/authType", getAuthType)
  .get("/session", getSession)
  .get("/logout", getLogout)
  .get("/mode", getProgramMode);

export default commonRouter;
