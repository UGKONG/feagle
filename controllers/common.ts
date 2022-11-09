import { Request, Response } from "express";
import { success } from "../functions/utils";

// 자료 유형 리스트 조회
export const getBoardType = (req: Request, res: Response) => {
  res.send(success("자료 유형 리스트 조회"));
};

// 액터 리스트 조회
export const getActor = (req: Request, res: Response) => {
  res.send(success("액터 리스트 조회"));
};

// 권한 유형 리스트 조회
export const getAuthType = (req: Request, res: Response) => {
  res.send(success("권한 유형 리스트 조회"));
};
