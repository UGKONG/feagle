import { Request, Response, NextFunction } from "express";
import { useDatabase } from "../functions/utils";
import { getClientIp } from "request-ip";

const local = "127.0.0.1";

const apiLogger = (req: Request, res: Response, next: NextFunction) => {
  const { method, path, params, body, query } = req;

  if (
    path?.indexOf(".") > -1 ||
    path.indexOf("/api/log") > -1 ||
    (method.toLowerCase() === "get" && path.indexOf("/api") === -1)
  ) {
    return next();
  }

  const ip = getClientIp(req) ?? "";
  const parameters = { ...params, ...query, ...body };
  const PARAMS = JSON.stringify(parameters);
  const IP = ip?.indexOf("::") > -1 ? local : ip || local;
  const METHOD = method?.toUpperCase();
  const PATH = path;
  const result = `
▶️  ${method} ${path}
▶️  ${JSON.stringify(parameters)}`;
  console.log(result);

  useDatabase(
    `
    INSERT INTO tb_api_log (
      LOG_IP, LOG_METHOD, LOG_PATH, LOG_PARAMS
    ) VALUES (
      ?, ?, ?, ?
    )
  `,
    [IP, METHOD, PATH, PARAMS]
  );

  next();
};

export default apiLogger;
