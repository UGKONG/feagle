import { Router } from "express";
import {
  deleteModel,
  getModelList,
  postModel,
  putModel,
} from "../controllers/model";

const modelRouter = Router();

modelRouter
  .get("/", getModelList)
  .post("/", postModel)
  .put("/:MDL_SQ", putModel)
  .delete("/:MDL_SQ", deleteModel);

export default modelRouter;
