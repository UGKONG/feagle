import { Request, Response } from "express";
import { fail, success, useDatabase } from "../functions/utils";
import { errorMessage } from "../string";

// 자료 유형 리스트 조회
export const getBoardType = async (req: Request, res: Response) => {
  const { error, result } = await useDatabase(`
    SELECT
    COMM_CODE, COMM_NM
    FROM tb_common
    WHERE COMM_GRP = 3
    AND COMM_CODE > 0;
  `);
  if (error) return res.send(fail(errorMessage.db));
  res.send(success(result));
};

// 액터 리스트 조회
export const getActor = async (req: Request, res: Response) => {
  const { error, result } = await useDatabase(`
    SELECT
    COMM_CODE, COMM_NM
    FROM tb_common
    WHERE COMM_GRP = 2
    AND COMM_CODE > 0;
  `);
  if (error) return res.send(fail(errorMessage.db));
  res.send(success(result));
};

// 권한 유형 리스트 조회
export const getAuthType = async (req: Request, res: Response) => {
  const { error, result } = await useDatabase(`
    SELECT
    COMM_CODE, COMM_NM
    FROM tb_common
    WHERE COMM_GRP = 4
    AND COMM_CODE > 0;
  `);
  if (error) return res.send(fail(errorMessage.db));
  res.send(success(result));
};

// 세션 정보 조회
export const getSession = async (req: any, res: Response) => {
  res.send(req.session.user || null);
};

// 로그아웃
export const getLogout = async (req: any, res: Response) => {
  req.session.destroy(() => res.send());
};
