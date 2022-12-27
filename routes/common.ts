import { Router } from "express";
import {
  getBoardType,
  getActor,
  getAuthType,
  getSession,
  getLogout,
  getProgramMode,
  getDataTypeList,
  getCommAddrList,
} from "../controllers/common";

const commonRouter = Router();

commonRouter
  .get("/boardType", getBoardType)
  .get("/dataType", getDataTypeList)
  .get("/actor", getActor)
  .get("/authType", getAuthType)
  .get("/session", getSession)
  .get("/logout", getLogout)
  .get("/mode", getProgramMode)
  .get("/address", getCommAddrList);

export default commonRouter;
