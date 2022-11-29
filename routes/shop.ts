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
  .get("/:SHOP_SQ", getShop)
  .post("/", postShop)
  .post("/:SHOP_SQ", postShopActivate)
  .put("/:SHOP_SQ", putShop)
  .delete("/:SHOP_SQ", deleteShop);

export default shopRouter;
