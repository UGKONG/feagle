import { Request, Response } from "express";
import { success } from "../functions/utils";

// 피부샵 리스트 조회
export const getShopList = (req: Request, res: Response) => {
  res.send(success("피부샵 리스트 조회"));
};

// 피부샵 상세정보 조회
export const getShop = (req: Request, res: Response) => {
  res.send(success("피부샵 상세정보 조회"));
};

// 피부샵 추가
export const postShop = (req: Request, res: Response) => {
  res.send(success("피부샵 추가"));
};

// 피부샵 활성화
export const postShopActivate = (req: Request, res: Response) => {
  res.send(success("피부샵 활성화"));
};

// 피부샵 정보 수정
export const putShop = (req: Request, res: Response) => {
  res.send(success("피부샵 정보 수정"));
};

// 피부샵 비활성화
export const deleteShop = (req: Request, res: Response) => {
  res.send(success("피부샵 비활성화"));
};
