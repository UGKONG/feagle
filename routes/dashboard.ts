import { Router } from "express";
import { getAddressList, getShopList } from "../controllers/dashboard";

const dashboardRoute = Router();

dashboardRoute.get("/", getAddressList).get("/:ADDR_SQ", getShopList);

export default dashboardRoute;
