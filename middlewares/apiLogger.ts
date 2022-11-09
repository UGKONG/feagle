import { Request, Response, NextFunction } from "express";

const apiLogger = (req: Request, res: Response, next: NextFunction) => {
  const { method, path, params, body, query } = req;
  const parameters = { ...params, ...query, ...body };
  const result = `
${method} ${path}
${JSON.stringify(parameters)}
`;
  console.log(result);
  next();
};

export default apiLogger;
