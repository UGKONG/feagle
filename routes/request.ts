import { Router } from "express";
import {
  getNewVersion,
  postVersion,
  postVersionDownload,
  postOn,
  postOff,
  postAlive,
  postStart,
  postEnd,
  postUse,
} from "../controllers/request";

const requestRouter = Router();

requestRouter
  .get("/version", getNewVersion)
  .get("/versionDownload", postVersionDownload)
  .post("/version", postVersion)
  .post("/on", postOn)
  .post("/off", postOff)
  .post("/alive", postAlive)
  .post("/start", postStart)
  .post("/end", postEnd)
  .post("/use", postUse);

export default requestRouter;
