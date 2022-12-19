import { Request, Response, NextFunction } from "express";
import { fail } from "../functions/utils";

// 예외 Path 리스트
const passList: string[] = [
  "/signin",
  "/signup",
  "/signout",
  "/api/common/logout",
  "/api/common/session",
  "/api/master/duplicate",
  "/api/master/login",
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
const filePassList: string[] = [
  ".ico",
  ".js",
  ".ts",
  ".jpg",
  ".png",
  ".jpeg",
  ".gif",
  ".bmp",
];

const sessionCheck = (req: Request, res: Response, next: NextFunction) => {
  const { path, session } = req;
  const loginSession = (session as any)?.user;
  console.log({ path });

  let isFile: boolean = false;
  filePassList?.forEach((x) => {
    if (path?.indexOf(x) > -1) isFile = true;
  });
  if (isFile) {
    console.log("file이라 pass");
    return next();
  }

  const isSignin: boolean = path?.indexOf("signin") > -1;
  const isSignup: boolean = path?.indexOf("signup") > -1;
  if (isSignin || isSignup) {
    console.log("로그인 페이지라 pass");
    return next();
  }

  const isAPI: boolean = path?.indexOf("api") > -1;
  const isPassPage: boolean = passList?.indexOf(path) > -1;

  if (isPassPage) {
    console.log("로그인이 필요없는 페이지라 pass");
    return next();
  }
  if (isAPI && !Object.keys(loginSession ?? {})?.length) {
    return res.send(fail("세션이 만료되었습니다."));
  }
  if (loginSession) {
    console.log("로그인이 완료되어 pass");
    return next();
  }

  console.log("리다이렉트", { loginSession });
  return res.redirect("/signin");
};

export default sessionCheck;
