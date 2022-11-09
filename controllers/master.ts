import { Request, Response } from "express";
import { success } from "../functions/utils";

// 마스터 리스트 조회
export const getMasterList = (req: Request, res: Response) => {
  res.send(success("마스터 리스트 조회"));
};

// 마스터 정보 조회
export const getMaster = (req: Request, res: Response) => {
  res.send(success("마스터 정보 조회"));
};

// 마스터 추가 (회원가입)
export const postMaster = (req: Request, res: Response) => {
  res.send(success("마스터 추가"));
};
