import { Router } from "express";
import {
  getBoardType,
  getActor,
  getAuthType,
  getSession,
  getLogout,
} from "../controllers/common";

const commonRouter = Router();

commonRouter
  .get("/boardType", getBoardType)
  .get("/actor", getActor)
  .get("/authType", getAuthType)
  .get("/session", getSession)
  .get("/logout", getLogout);

export default commonRouter;
