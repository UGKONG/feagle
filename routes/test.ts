import { Router } from "express";
import { test } from "../controllers/test";

const versionRoute = Router();

versionRoute.get("/", test);

export default versionRoute;
