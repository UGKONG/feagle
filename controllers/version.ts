import { Request, Response } from "express";
import { success } from "../functions/utils";

// 현재 최신 버전 조회
export const getNewVersion = (req: Request, res: Response) => {
  res.send(success("현재 최신 버전 조회"));
};
