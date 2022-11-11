import { Request, Response } from "express";
import { fail, success, useDatabase } from "../functions/utils";

// 자료 유형 리스트 조회
export const getBoardType = (req: Request, res: Response) => {
  res.send(success("자료 유형 리스트 조회"));
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
  if (error) return res.send(fail("database error"));
  res.send(success(result));
};

// 권한 유형 리스트 조회
export const getAuthType = (req: Request, res: Response) => {
  res.send(success("권한 유형 리스트 조회"));
};
