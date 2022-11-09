import { Request, Response } from "express";
import { success } from "../functions/utils";

// API 로그 리스트 조회
export const getApiLogList = (req: Request, res: Response) => {
  res.send(success("API 로그 리스트 조회"));
};

// 다운로드 로그 리스트 조회
export const getDownloadLogList = (req: Request, res: Response) => {
  res.send(success("다운로드 로그 리스트 조회"));
};

// 로그 리스트 조회
export const getLogList = (req: Request, res: Response) => {
  res.send(success("로그 리스트 조회"));
};
