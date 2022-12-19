import { Router } from "express";
import {
  getDeviceList,
  getDeviceDetail,
  postDevice,
  postShopDevice,
  putDevice,
  deleteDevice,
  getDeviceUseChart,
  getDeviceDataChart,
} from "../controllers/device";

const deviceRouter = Router();

deviceRouter
  .get("/", getDeviceList)
  .get("/useChart/:DEVICE_SQ", getDeviceUseChart)
  .get("/dataChart/:DEVICE_SQ", getDeviceDataChart)
  .get("/:DEVICE_SQ", getDeviceDetail)
  .post("/", postDevice)
  .post("/:SHOP_SQ", postShopDevice)
  .put("/:DEVICE_SQ", putDevice)
  .delete("/:DEVICE_SQ", deleteDevice);

export default deviceRouter;
