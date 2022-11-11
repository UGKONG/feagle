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
  .get("/:DEVICE_SQ", getDeviceDetail)
  .post("/", postDevice)
  .put("/:DEVICE_SQ", putDevice)
  .delete("/:DEVICE_SQ", deleteDevice);

export default deviceRouter;
