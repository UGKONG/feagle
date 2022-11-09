import { Router } from "express";
import {
  getApiLogList,
  getDownloadLogList,
  getLogList,
} from "../controllers/log";

const logRouter = Router();

logRouter
  .get("/api", getApiLogList)
  .get("/download", getDownloadLogList)
  .get("/history", getLogList);

export default logRouter;
