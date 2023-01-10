import { Router } from "express";
import {
  deleteManager,
  getManagerDetail,
  getManagerList,
  postFindId,
  postFindPw,
  postLogin,
  putManager,
  putPassword,
} from "../controllers/manager";

const managerRouter = Router();

managerRouter
  .get("/", getManagerList)
  .get("/:MNG_SQ", getManagerDetail)
  .post("/findId", postFindId)
  .post("/findPw", postFindPw)
  .post("/login", postLogin)
  .put("/changePw/:MNG_SQ", putPassword)
  .put("/:MNG_SQ", putManager)
  .delete("/:MNG_SQ", deleteManager);

export default managerRouter;
