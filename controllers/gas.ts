import { Request, Response } from "express";
import { success } from "../functions/utils";

// 가스 요청 리스트 조회
export const getGasRequestList = (req: Request, res: Response) => {
  res.send(success("가스 요청 리스트 조회"));
};

// 가스 요청
export const postGasRequest = (req: Request, res: Response) => {
  res.send(success("가스 요청"));
};

// 가스 요청건 확인
export const putGasRequestCheck = (req: Request, res: Response) => {
  res.send(success("가스 요청건 확인"));
};
