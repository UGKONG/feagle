import { Router } from "express";
import { getMaster, getMasterAuth } from "../controllers/master";

const masterRouter = Router();

masterRouter.get("/", getMaster).get("/auth", getMasterAuth);

export default masterRouter;
