import { Request, Response, NextFunction } from "express";

// 예외 Path 리스트
const passList: string[] = [
  "/signin",
  "/signup",
  "/signout",
  "/api/test",
  "/api/sign/in",
  "/api/sign/out",
  "/api/request/version",
  "/api/request/download",
  "/api/request/on",
  "/api/request/alive",
  "/api/request/start",
  "/api/request/end",
  "/api/request/remainGas",
  "/api/request/gasPressure",
  "/api/request/gasFlow",
  "/api/request/accrueUseTime",
  "/api/request/plasmaElectric",
];

const sessionCheck = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { path, session } = req;
  const isPass: boolean = passList?.indexOf(path) > -1;

  // 예외 Path가 아니고 세션도 없다면 리다이렉트
  if (!session && !isPass) return res.redirect("/signin");

  // Pass
  next();
};

export default sessionCheck;
