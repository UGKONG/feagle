import { Router } from "express";
import {
  getGasRequestList,
  getShopGasRequestList,
  postGasRequest,
  putGasRequestCheck,
  deleteGasRequestCheck,
} from "../controllers/gas";

const gasRouter = Router();

gasRouter
  .get("/", getGasRequestList)
  .get("/:SHOP_SQ", getShopGasRequestList)
  .post("/", postGasRequest)
  .put("/:GR_SQ", putGasRequestCheck)
  .delete("/:GR_SQ", deleteGasRequestCheck);

export default gasRouter;
