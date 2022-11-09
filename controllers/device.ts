import { Request, Response } from "express";
import { success } from "../functions/utils";

// 장비 리스트 조회
export const getDeviceList = (req: Request, res: Response) => {
  res.send(success("장비 리스트 조회"));
};

// 장비 상세정보 조회
export const getDeviceDetail = (req: Request, res: Response) => {
  res.send(success("장비 상세정보 조회"));
};

// 장비 추가
export const postDevice = (req: Request, res: Response) => {
  res.send(success("장비 추가"));
};

// 장비 정보 수정
export const putDevice = (req: Request, res: Response) => {
  res.send(success("장비 정보 수정"));
};

// 장비 정보 삭제
export const deleteDevice = (req: Request, res: Response) => {
  res.send(success("장비 정보 삭제"));
};
