const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const multipart = require("connect-multiparty");

import express from "express";
import cors from "cors";
import session from "express-session";
import { programName } from "./string";
import serverStart from "./functions/serverStart";
import apiLogger from "./middlewares/apiLogger";
import view from "./routes/view.json";
import testRoute from "./routes/test";
import masterRouter from "./routes/master";
import requestRouter from "./routes/request";
import deviceRouter from "./routes/device";
import commonRouter from "./routes/common";
import shopRouter from "./routes/shop";
import boardRouter from "./routes/board";
import fileRouter from "./routes/file";
import gasRouter from "./routes/gas";
import logRouter from "./routes/log";
import managerRouter from "./routes/manager";
import modelRouter from "./routes/model";
import deviceDoRouter from "./routes/deviceDo";
import dashboardRoute from "./routes/dashboard";

// Setting
dotenv.config();
const MySQLStore = require("express-mysql-session")(session);
const app = express();
const port = process.env.SERVER_PORT || 8080;
const basePath = __dirname + "/build";
const multipartMiddleware = multipart();
const sessionConfig = session({
  secret: programName,
  resave: false,
  saveUninitialized: true,
  rolling: true,
  cookie: {
    path: "/",
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 1000 * 2, // 2시간 세션 유지
  },
  store: new MySQLStore({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  }),
});

// Middleware
app.use(cors());
app.use(apiLogger);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(sessionConfig);
app.use(multipartMiddleware);

// Upload File Router
app.use(express.static("upload"));

// View Router
view?.master?.forEach((path: string) => {
  app.use(path, express.static(basePath));
});
view?.manager?.forEach((path: string) => {
  app.use("/manager" + path, express.static(basePath));
});

// Api Router
app.use("/api/test", testRoute);
app.use("/api/request", requestRouter);
app.use("/api/common", commonRouter);
app.use("/api/model", modelRouter);
app.use("/api/device", deviceRouter);
app.use("/api/master", masterRouter);
app.use("/api/manager", managerRouter);
app.use("/api/shop", shopRouter);
app.use("/api/board", boardRouter);
app.use("/api/file", fileRouter);
app.use("/api/gas", gasRouter);
app.use("/api/log", logRouter);
app.use("/api/deviceDo", deviceDoRouter);
app.use("/api/dashboard", dashboardRoute);

// Start
app.listen(port, serverStart);
