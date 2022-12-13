import { Router } from "express";
import {
  deleteDeviceDo,
  getDeviceDoList,
  postDeviceDo,
} from "../controllers/deviceDo";

const deviceDoRouter = Router();

deviceDoRouter
  .get("/:DEVICE_SQ", getDeviceDoList)
  .post("/", postDeviceDo)
  .delete("/:DO_SQ", deleteDeviceDo);

export default deviceDoRouter;
