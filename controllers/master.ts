import { Request, Response } from "express";
import { success } from "../functions/utils";

// 마스터 정보 조회
export const getMaster = (req: Request, res: Response) => {
  res.send(success("마스터 정보 조회"));
};

export const getMasterAuth = (req: Request, res: Response) => {
  res.send(success("마스터 권한 정보 조회"));
};
