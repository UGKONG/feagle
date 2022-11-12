import { Request, Response } from "express";
import { fail, success, useDatabase } from "../functions/utils";
import { errorMessage } from "../string";

// 마스터 정보 공통 Query
const masterCommonQuery = `
  SELECT
  a.MST_SQ, a.MST_NM, a.MST_NUM, a.MST_GRP, a.MST_PO,
  a.MST_GD, a.MST_ID, a.AUTH_SQ, b.COMM_NM AS AUTH_TEST
  FROM tb_master a
  LEFT JOIN tb_common b ON b.COMM_CODE = a.AUTH_SQ
  AND COMM_GRP = 4 AND COMM_CODE > 0
  WHERE IS_DEL = 0
`;

// 마스터 리스트 조회
export const getMasterList = async (req: Request, res: Response) => {
  const { error, result } = await useDatabase(masterCommonQuery);
  if (error) return res.send(fail(errorMessage.db));
  res.send(success(result));
};

// 마스터 정보 조회
export const getMasterDetail = async (req: Request, res: Response) => {
  const MST_SQ = req?.params?.MST_SQ;
  const { error, result } = await useDatabase(
    `
    ${masterCommonQuery} AND MST_SQ = ?;
  `,
    [MST_SQ]
  );

  if (error) return res.send(fail(errorMessage.db));
  if (!result[0]) return res.send(success(null));
  res.send(success(result[0]));
};

// 마스터 추가 (회원가입)
export const postMaster = async (req: Request, res: Response) => {
  const MST_NM = req?.query?.MST_NM ?? req?.body?.MST_NM;
  const MST_NUM = req?.query?.MST_NUM ?? req?.body?.MST_NUM;
  const MST_GRP = req?.query?.MST_GRP ?? req?.body?.MST_GRP;
  const MST_PO = req?.query?.MST_PO ?? req?.body?.MST_PO;
  const MST_GD = req?.query?.MST_GD ?? req?.body?.MST_GD;
  const MST_ID = req?.query?.MST_ID ?? req?.body?.MST_ID;
  const MST_PW = req?.query?.MST_PW ?? req?.body?.MST_PW;
  const AUTH_SQ = req?.query?.AUTH_SQ ?? req?.body?.AUTH_SQ;

  const { error } = await useDatabase(
    `
    INSERT INTO tb_master (
      MST_NM, MST_NUM, MST_GRP, MST_PO, 
      MST_GD, MST_ID, MST_PW, AUTH_SQ
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?
    )
  `,
    [MST_NM, MST_NUM, MST_GRP, MST_PO, MST_GD, MST_ID, MST_PW, AUTH_SQ]
  );
  if (error) return res.send(fail(errorMessage.db));
  res.send(success(null));
};

// 아이디 중복확인
export const getMasterIdDuplicateCheck = async (
  req: Request,
  res: Response
) => {
  const MST_ID = req?.query?.MST_ID ?? req?.body?.MST_ID;
  if (!MST_ID) return res.send(fail(errorMessage.parameter));
  const { error, result } = await useDatabase(
    `
    SELECT COUNT(*) AS COUNT FROM tb_master
    WHERE MST_ID = ?
  `,
    [MST_ID]
  );

  if (error) return res.send(fail(errorMessage.db));
  res.send(success({ duplicate: result[0]?.COUNT > 0 }));
};

// 마스터 정보 수정
export const putMaster = async (req: Request, res: Response) => {
  const MST_SQ = req?.params?.MST_SQ ?? req?.query?.MST_NM ?? req?.body?.MST_NM;
  const MST_NM = req?.query?.MST_NM ?? req?.body?.MST_NM;
  const MST_NUM = req?.query?.MST_NUM ?? req?.body?.MST_NUM;
  const MST_GRP = req?.query?.MST_GRP ?? req?.body?.MST_GRP;
  const MST_PO = req?.query?.MST_PO ?? req?.body?.MST_PO;
  const MST_GD = req?.query?.MST_GD ?? req?.body?.MST_GD;
  const MST_ID = req?.query?.MST_ID ?? req?.body?.MST_ID;
  const MST_PW = req?.query?.MST_PW ?? req?.body?.MST_PW;
  const AUTH_SQ = req?.query?.AUTH_SQ ?? req?.body?.AUTH_SQ;

  const { error } = await useDatabase(
    `
    UPDATE tb_master SET
    MST_NM = ?, MST_NUM = ?, MST_GRP = ?, MST_PO = ?, 
    MST_GD = ?, MST_ID = ?, MST_PW = ?, AUTH_SQ = ?
    WHERE MST_SQ = ?
  `,
    [MST_NM, MST_NUM, MST_GRP, MST_PO, MST_GD, MST_ID, MST_PW, AUTH_SQ, MST_SQ]
  );

  if (error) return res.send(fail(errorMessage.db));
  res.send(success(null));
};

// 마스터 정보 삭제 (회원탈퇴)
export const deleteMaster = async (req: Request, res: Response) => {
  const MST_SQ = req?.params?.MST_SQ;
  const { error } = await useDatabase(
    `
    UPDATE tb_master SET IS_DEL = 1 WHERE MST_SQ = ?;
  `,
    [MST_SQ]
  );

  if (error) return res.send(fail(errorMessage.db));
  res.send(success(null));
};

// 마스터 로그인
export const postLogin = async (req: Request, res: Response) => {
  const MST_ID = req?.query?.MST_ID ?? req?.body?.MST_ID;
  const MST_PW = req?.query?.MST_PW ?? req?.body?.MST_PW;
  if (!MST_ID || !MST_PW) return res.send(fail(errorMessage.parameter));

  const { error, result } = await useDatabase(
    `
    ${masterCommonQuery}
    AND MST_ID = ? AND MST_PW = ?;
  `,
    [MST_ID, MST_PW]
  );

  if (error) return res.send(fail(errorMessage.db));
  if (!result[0]) return res.send(success(null));
  res.send(success(result[0]));
};