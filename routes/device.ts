import { Router } from "express";
import {
  getDeviceList,
  getDeviceDetail,
  postDevice,
  putDevice,
  deleteDevice,
} from "../controllers/device";

const deviceRouter = Router();

deviceRouter
  .get("/", getDeviceList)
  .get("/:deviceSq", getDeviceDetail)
  .post("/", postDevice)
  .put("/:deviceSq", putDevice)
  .delete("/:deviceSq", deleteDevice);

export default deviceRouter;
