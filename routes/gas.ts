import { Router } from "express";
import {
  getGasRequestList,
  postGasRequest,
  putGasRequestCheck,
} from "../controllers/gas";

const gasRouter = Router();

gasRouter
  .get("/", getGasRequestList)
  .post("/", postGasRequest)
  .put("/:reqSq", putGasRequestCheck);

export default gasRouter;
