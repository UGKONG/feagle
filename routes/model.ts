import { Router } from "express";
import { getModelList } from "../controllers/model";

const modelRouter = Router();

modelRouter.get("/", getModelList);

export default modelRouter;
