import { Router } from "express";
import {
  getDeviceList,
  getDeviceDetail,
  postDevice,
  postShopDevice,
  putDevice,
  deleteDevice,
} from "../controllers/device";

const deviceRouter = Router();

deviceRouter
  .get("/", getDeviceList)
  .get("/:DEVICE_SQ", getDeviceDetail)
  .post("/", postDevice)
  .post("/:SHOP_SQ", postShopDevice)
  .put("/:DEVICE_SQ", putDevice)
  .delete("/:DEVICE_SQ", deleteDevice);

export default deviceRouter;
