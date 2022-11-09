import { Request, Response } from "express";
import { success } from "../functions/utils";

// 신규 버전 정보 조회 (서버 -> 장비)
export const getNewVersion = (req: Request, res: Response) => {
  res.send(success("신규 버전 정보 조회 (서버 -> 장비)"));
};

// 현재 버전 정보 저장 (장비 -> 서버)
export const postVersion = (req: Request, res: Response) => {
  res.send(success("현재 버전 정보 저장 (장비 -> 서버)"));
};

// 해당 버전 파일 다운로드
export const postDownload = (req: Request, res: Response) => {
  res.send(success("해당 버전 파일 다운로드"));
};

// 장비 On 정보 저장
export const postOn = (req: Request, res: Response) => {
  res.send(success("장비 On 정보 저장"));
};

// 장비 Alive 정보 저장
export const postAlive = (req: Request, res: Response) => {
  res.send(success("장비 Alive 정보 저장"));
};

// 사용 시작 일시 저장
export const postStart = (req: Request, res: Response) => {
  res.send(success("사용 시작 일시 저장"));
};

// 사용 종료 일시 저장
export const postEnd = (req: Request, res: Response) => {
  res.send(success("사용 종료 일시 저장"));
};

// 가스잔량 저장
export const postRemainGas = (req: Request, res: Response) => {
  res.send(success("가스잔량 저장"));
};

// 가스얍력 저장
export const postGasPressure = (req: Request, res: Response) => {
  res.send(success("가스얍력 저장"));
};

// 가스유량 저장
export const postGasFlow = (req: Request, res: Response) => {
  res.send(success("가스유량 저장"));
};

// 누적사용시간
export const postAccrueUseTime = (req: Request, res: Response) => {
  res.send(success("누적사용시간"));
};

// 플라즈마 전류
export const postPlasmaElectric = (req: Request, res: Response) => {
  res.send(success("플라즈마 전류"));
};
