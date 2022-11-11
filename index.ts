import express from "express";
import cors from "cors";
import { programName } from "./string";
import serverStart from "./functions/serverStart";
import view from "./functions/view";
import apiLogger from "./middlewares/apiLogger";
import sessionCheck from "./middlewares/sessionCheck";
import viewRoutes from "./routes/view.json";
import testRoute from "./routes/test";
import masterRouter from "./routes/master";
import requestRouter from "./routes/request";
import deviceRouter from "./routes/device";
import commonRouter from "./routes/common";
import shopRouter from "./routes/shop";
import versionRouter from "./routes/version";
import fileRouter from "./routes/file";
import gasRouter from "./routes/gas";
import logRouter from "./routes/log";
import signRouter from "./routes/sign";

// Setting
require("dotenv").config();
const app = express();
const port = process.env.SERVER_PORT || 8080;
const multiparty = require("connect-multiparty")();
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
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
app.use(express.json());
app.use(apiLogger);
// app.use(sessionCheck);
app.use(sessionConfig);
app.use(express.static(__dirname + "/build"));

// View Router
viewRoutes.forEach((path: string) => app.get(path, view));

// Api Router
app.use("/api/test", multiparty, testRoute);
app.use("/api/sign", multiparty, signRouter);
app.use("/api/request", multiparty, requestRouter);
app.use("/api/common", multiparty, commonRouter);
app.use("/api/device", multiparty, deviceRouter);
app.use("/api/master", multiparty, masterRouter);
app.use("/api/shop", multiparty, shopRouter);
app.use("/api/version", multiparty, versionRouter);
app.use("/api/file", multiparty, fileRouter);
app.use("/api/gas", multiparty, gasRouter);
app.use("/api/log", multiparty, logRouter);

// Start
app.listen(port, serverStart);
