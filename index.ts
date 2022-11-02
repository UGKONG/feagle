import express from "express";
import cors from "cors";
import env from "dotenv";
import view from "./controllers/view";
import serverStart from "./functions/serverStart";
import viewRoutes from "./routes/view.json";
import testRoute from "./routes/test";
import masterRouter from "./routes/master";

const app = express();
const port = process.env.SERVER_PORT || 8080;
const multipartMiddleware = require("connect-multiparty")();

// Setting
env.config();
app.use(cors());
app.use(express.json());

// Router
const absolutePath: string = __dirname + "/build";
app.use(express.static(absolutePath));
viewRoutes.forEach((path: string) => app.get(path, view));

// Api
app.use("/api/test", multipartMiddleware, testRoute);
app.use("/api/master", multipartMiddleware, masterRouter);

// Start
app.listen(port, serverStart);
