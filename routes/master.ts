import { Router } from "express";
import { getMasterList, getMaster, postMaster } from "../controllers/master";

const masterRouter = Router();

masterRouter
  .get("/", getMasterList)
  .get("/:masterSq", getMaster)
  .post("/", postMaster);

export default masterRouter;
