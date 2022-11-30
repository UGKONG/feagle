import { Router } from "express";
import {
  deleteManager,
  getManagerDetail,
  getManagerList,
  postLogin,
  putManager,
} from "../controllers/manager";

const managerRouter = Router();

managerRouter
  .get("/", getManagerList)
  .get("/:MNG_SQ", getManagerDetail)
  .post("/login", postLogin)
  .put("/:MNG_SQ", putManager)
  .delete("/:MNG_SQ", deleteManager);

export default managerRouter;
