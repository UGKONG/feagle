import { Router } from "express";
import {
  getMasterList,
  getMasterDetail,
  postMaster,
  putMaster,
  deleteMaster,
  getMasterIdDuplicateCheck,
  postLogin,
} from "../controllers/master";

const masterRouter = Router();

masterRouter
  .get("/", getMasterList)
  .get("/duplicate", getMasterIdDuplicateCheck)
  .get("/:MST_SQ", getMasterDetail)
  .post("/", postMaster)
  .post("/login", postLogin)
  .put("/:MST_SQ", putMaster)
  .delete("/:MST_SQ", deleteMaster);

export default masterRouter;
