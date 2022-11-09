import { Router } from "express";
import {
  getShopList,
  getShop,
  postShop,
  postShopActivate,
  putShop,
  deleteShop,
} from "../controllers/shop";

const shopRouter = Router();

shopRouter
  .get("/", getShopList)
  .get("/:shopSq", getShop)
  .post("/", postShop)
  .post("/:shopId", postShopActivate)
  .put("/:shopId", putShop)
  .delete("/:shopId", deleteShop);

export default shopRouter;
