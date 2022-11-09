import { Router } from "express";
import {
  getNewVersion,
  postVersion,
  postDownload,
  postOn,
  postAlive,
  postStart,
  postEnd,
  postRemainGas,
  postGasPressure,
  postGasFlow,
  postAccrueUseTime,
  postPlasmaElectric,
} from "../controllers/request";

const requestRouter = Router();

requestRouter
  .get("/version", getNewVersion)
  .post("/version", postVersion)
  .post("/download", postDownload)
  .post("/on", postOn)
  .post("/alive", postAlive)
  .post("/start", postStart)
  .post("/end", postEnd)
  .post("/remainGas", postRemainGas)
  .post("/gasPressure", postGasPressure)
  .post("/gasFlow", postGasFlow)
  .post("/accrueUseTime", postAccrueUseTime)
  .post("/plasmaElectric", postPlasmaElectric);

export default requestRouter;
