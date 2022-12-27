import express from "express";
import cors from "cors";
import { programName } from "./string";
import serverStart from "./functions/serverStart";
import apiLogger from "./middlewares/apiLogger";
import viewRoutes from "./routes/view.json";
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
import { postBoard } from "./controllers/board";

// Setting
require("dotenv").config();
const app = express();
const port = process.env.SERVER_PORT || 8080;
const bodyParser = require("body-parser");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const multipart = require("connect-multiparty")();
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
const basePath = __dirname + "/build";

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(apiLogger);
app.use(sessionConfig);

// View Router
viewRoutes.forEach((path: string) => {
  app.use(path, express.static(basePath));
});

// Api Router
app.use("/api/test", multipart, testRoute);
app.use("/api/request", multipart, requestRouter);
app.use("/api/common", multipart, commonRouter);
app.use("/api/model", multipart, modelRouter);
app.use("/api/device", multipart, deviceRouter);
app.use("/api/master", multipart, masterRouter);
app.use("/api/manager", multipart, managerRouter);
app.use("/api/shop", multipart, shopRouter);
app.use("/api/board", multipart, boardRouter);
app.use("/api/file", multipart, fileRouter);
app.use("/api/gas", multipart, gasRouter);
app.use("/api/log", multipart, logRouter);
app.use("/api/deviceDo", multipart, deviceDoRouter);
app.use("/api/dashboard", multipart, dashboardRoute);

// Start
app.listen(port, serverStart);
