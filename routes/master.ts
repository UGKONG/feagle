import { Router } from "express";
import {
  getMasterList,
  getMasterJoinList,
  getMasterDetail,
  postMaster,
  putMaster,
  deleteMaster,
  postLogin,
  putMasterJoin,
  putMasterAuth,
} from "../controllers/master";

const masterRouter = Router();

masterRouter
  .get("/", getMasterList)
  .get("/join", getMasterJoinList)
  .get("/:MST_SQ", getMasterDetail)
  .post("/", postMaster)
  .post("/login", postLogin)
  .put("/join/:MST_SQ", putMasterJoin)
  .put("/auth/:MST_SQ", putMasterAuth)
  .put("/:MST_SQ", putMaster)
  .delete("/:MST_SQ", deleteMaster);

export default masterRouter;
