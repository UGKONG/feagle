import { Request, Response, NextFunction } from "express";

// 예외 Path 리스트
const passList: string[] = [
  "/myadmin",
  "/signin",
  "/signup",
  "/signout",
  "/api/test",
  "/api/sign/in",
  "/api/sign/out",
  "/api/request/version",
  "/api/request/versionDwnload",
  "/api/request/on",
  "/api/request/off",
  "/api/request/alive",
  "/api/request/start",
  "/api/request/end",
  "/api/request/use",
];

const sessionCheck = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { path, session } = req;
  const isPass1: boolean = passList?.indexOf(path) > -1;
  const isPass2: boolean = path?.indexOf("signin") > -1;

  if (isPass1 || session) return next();
  if (isPass2) return next();

  res.redirect("/signin");
};

export default sessionCheck;
