import { Request, Response } from "express";
import { success } from "../functions/utils";

// 로그인
export const signin = (req: Request, res: Response) => {
  res.send(success("로그인"));
};

// 로그아웃
export const signout = (req: Request, res: Response) => {
  res.send(success("로그아웃"));
};
