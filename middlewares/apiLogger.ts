import { Request, Response, NextFunction } from "express";
import { useDatabase } from "../functions/utils";
import { getClientIp } from "request-ip";

const apiLogger = (req: Request, res: Response, next: NextFunction) => {
  const { method, path, params, body, query } = req;
  const parameters = { ...params, ...query, ...body };
  const ip = getClientIp(req) ?? "";
  const result = `${method} ${path}
PARAMS ${JSON.stringify(parameters)}`;
  console.log(result);

  useDatabase(
    `
    INSERT INTO tb_log (
      LOG_TP, LOG_IP, LOG_TXT
    ) VALUES (
      ?, ?, ?
    )
  `,
    [1, ip, result]
  );

  next();
};

export default apiLogger;
