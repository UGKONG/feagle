import { Router } from "express";
import { signin, signout } from "../controllers/sign";

const signRouter = Router();

signRouter.get("/out", signout).post("/in", signin);

export default signRouter;
