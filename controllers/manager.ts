import { Request, Response } from "express";
import { fail, success, useDatabase, useIsNumber } from "../functions/utils";
import { errorMessage } from "../string";

// 매니저 정보 공통 Query
const managerCommonQuery = `
  SELECT
  a.MNG_SQ, a.MNG_NM, a.MNG_NUM, a.MNG_GD, 
  a.MNG_ID, a.SHOP_SQ, b.SHOP_NM, a.OS, a.UUID
  FROM tb_manager a
  LEFT JOIN tb_shop b ON b.SHOP_SQ = a.SHOP_SQ
  WHERE a.IS_DEL = 0
`;

// 매니저 리스트 조회
export const getManagerList = async (req: Request, res: Response) => {
  const { error, result } = await useDatabase(managerCommonQuery);
  if (error) return res.send(fail(errorMessage.db));
  res.send(success(result));
};

// 매니저 정보 조회
export const getManagerDetail = async (req: Request, res: Response) => {
  const MNG_SQ = req?.params?.MNG_SQ;
  if (!useIsNumber(MNG_SQ)) return res.send(fail(errorMessage.parameter));

  const { error, result } = await useDatabase(
    `
    ${managerCommonQuery} AND MNG_SQ = ?;
  `,
    [MNG_SQ]
  );

  if (error) return res.send(fail(errorMessage.db));
  if (!result[0]) return res.send(success(null));
  res.send(success(result[0]));
};

// 매니저 정보 수정
export const putManager = async (req: Request, res: Response) => {
  const MNG_SQ = req?.params?.MNG_SQ ?? req?.query?.MNG_NM ?? req?.body?.MNG_NM;
  if (!useIsNumber(MNG_SQ)) return res.send(fail(errorMessage.parameter));

  const MNG_NM = req?.query?.MNG_NM ?? req?.body?.MNG_NM;
  const MNG_NUM = req?.query?.MNG_NUM ?? req?.body?.MNG_NUM;
  const MNG_GD = req?.query?.MNG_GD ?? req?.body?.MNG_GD;

  const validate = !MNG_NM || !MNG_NUM || !MNG_GD;
  if (validate) return res.send(fail(errorMessage.parameter));

  const { error } = await useDatabase(
    `
    UPDATE tb_manager SET
    MNG_NM = ?, MNG_NUM = ?, MNG_GD = ?
    WHERE MNG_SQ = ?
  `,
    [MNG_NM, MNG_NUM, MNG_GD, MNG_SQ]
  );

  if (error) return res.send(fail(errorMessage.db));
  res.send(success(null));
};

// 매니저 정보 삭제
export const deleteManager = async (req: Request, res: Response) => {
  const MNG_SQ = req?.params?.MNG_SQ ?? req?.query?.MNG_NM ?? req?.body?.MNG_NM;
  if (isNaN(Number(MNG_SQ))) return res.send(fail(errorMessage.parameter));

  const { error } = await useDatabase(
    `
    UPDATE tb_manager SET IS_DEL = 1 WHERE MNG_SQ = ?;
  `,
    [MNG_SQ]
  );

  if (error) return res.send(fail(errorMessage.db));
  res.send(success(null));
};

// 매니저 로그인
export const postLogin = async (req: any, res: Response) => {
  const MNG_ID = req?.query?.MNG_ID ?? req?.body?.MNG_ID;
  const MNG_PW = req?.query?.MNG_PW ?? req?.body?.MNG_PW;
  if (!MNG_ID || !MNG_PW) return res.send(fail(errorMessage.parameter));

  const { error, result } = await useDatabase(
    `
    ${managerCommonQuery}
    AND MNG_ID = ? AND MNG_PW = ?
    ORDER BY MNG_SQ DESC LIMIT 1;
    ;
  `,
    [MNG_ID, MNG_PW]
  );

  const user = result[0];

  // 로그인 실패
  if (error || !user) req.session.user = null;
  if (error) return res.send(fail(errorMessage.db));
  if (!user) return res.send(fail("아이디 또는 비밀번호가 일치하지 않습니다."));

  // 로그인 성공
  req.session.user = user;
  res.send(success(user));
};