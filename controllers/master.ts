import { Request, Response } from "express";
import { fail, success, useDatabase, useIsNumber } from "../functions/utils";
import { errorMessage } from "../string";

// 마스터 정보 공통 Query
const masterCommonQuery = `
  SELECT
  a.MST_SQ, a.MST_NM, a.MST_NUM, a.MST_GRP, a.MST_PO,
  a.MST_GD, a.MST_ID, a.AUTH_SQ, b.COMM_NM AS AUTH_TEXT,
  a.MST_JOIN_DT, a.MST_CRT_DT, a.IS_USE
  FROM tb_master a
  LEFT JOIN tb_common b ON b.COMM_CODE = a.AUTH_SQ
  AND b.COMM_GRP = 4 AND b.COMM_CODE > 0
  WHERE a.IS_DEL = 0 AND a.AUTH_SQ IS NOT NULL
`;

// 마스터 리스트 조회
export const getMasterList = async (req: Request, res: Response) => {
  const { error, result } = await useDatabase(`
    ${masterCommonQuery}
    ORDER BY a.MST_SQ DESC;
  `);
  if (error) return res.send(fail(errorMessage.db));
  res.send(success(result));
};

// 마스터 정보 조회
export const getMasterDetail = async (req: Request, res: Response) => {
  const MST_SQ = req?.params?.MST_SQ;
  if (!useIsNumber(MST_SQ)) return res.send(fail(errorMessage.parameter));

  const { error, result } = await useDatabase(
    `
    ${masterCommonQuery} AND a.MST_SQ = ?;
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

  const validate = !MST_NM || !MST_NUM || !MST_GD || !MST_ID || !MST_PW;
  if (validate) {
    return res.send(fail(errorMessage.parameter));
  }

  const { error: error1, result } = await useDatabase(
    `
    SELECT COUNT(*) AS COUNT FROM tb_master
    WHERE MST_ID = ?
  `,
    [MST_ID]
  );
  if (error1) return res.send(fail(errorMessage.db));
  if (result[0]?.COUNT > 0) {
    return res.send(fail("아이디가 중복됩니다."));
  }

  const { error: error2 } = await useDatabase(
    `
    INSERT INTO tb_master (
      MST_NM, MST_NUM, MST_GRP, MST_PO, 
      MST_GD, MST_ID, MST_PW
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?
    )
  `,
    [MST_NM, MST_NUM, MST_GRP, MST_PO, MST_GD, MST_ID, MST_PW]
  );
  if (error2) return res.send(fail(errorMessage.db));
  res.send(success(null));
};

// 마스터 정보 수정
export const putMaster = async (req: Request, res: Response) => {
  const MST_SQ = req?.params?.MST_SQ ?? req?.query?.MST_NM ?? req?.body?.MST_NM;
  if (!useIsNumber(MST_SQ)) return res.send(fail(errorMessage.parameter));

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
  if (!useIsNumber(MST_SQ)) return res.send(fail(errorMessage.parameter));

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
export const postLogin = async (req: any, res: Response) => {
  const MST_ID = req?.query?.MST_ID ?? req?.body?.MST_ID;
  const MST_PW = req?.query?.MST_PW ?? req?.body?.MST_PW;
  if (!MST_ID || !MST_PW) return res.send(fail(errorMessage.parameter));

  const { error, result } = await useDatabase(
    `
    SELECT
    a.MST_SQ, a.MST_NM, a.MST_NUM, a.MST_GRP, a.MST_PO,
    a.MST_GD, a.MST_ID, a.AUTH_SQ, b.COMM_NM AS AUTH_TEXT,
    a.MST_JOIN_DT, a.MST_CRT_DT, a.IS_USE
    FROM tb_master a
    LEFT JOIN tb_common b ON b.COMM_CODE = a.AUTH_SQ
    AND b.COMM_GRP = 4 AND b.COMM_CODE > 0
    WHERE a.IS_DEL = 0
    AND a.MST_ID = ? AND a.MST_PW = ?
    ORDER BY a.MST_SQ DESC LIMIT 1;
    ;
  `,
    [MST_ID, MST_PW]
  );

  const user = result[0];

  // 로그인 실패
  if (error || !user) req.session.user = null;
  if (error) return res.send(fail(errorMessage.db));
  if (!user) return res.send(fail("아이디 또는 비밀번호가 일치하지 않습니다."));

  // 신청자
  if (!user?.AUTH_SQ) {
    return res.send(
      fail("아직 신청수락이 되지 않은 계정입니다. 관리자에게 문의해주세요.")
    );
  }

  // 사용중지
  if (user?.AUTH_SQ == 5) {
    return res.send(fail("사용중지된 계정입니다. 관리자에게 문의해주세요."));
  }

  // 로그인 성공
  req.session.user = { ...user, ACT_TP: 2 };
  res.send(success(user));
};

// 가입 요청자 리스트
export const getMasterJoinList = async (req: Request, res: Response) => {
  const { error, result } = await useDatabase(
    `
    SELECT
    a.MST_SQ, a.MST_NM, a.MST_NUM, a.MST_GRP, a.MST_PO,
    a.MST_GD, a.MST_ID, a.AUTH_SQ, b.COMM_NM AS AUTH_TEXT,
    a.MST_CRT_DT
    FROM tb_master a
    LEFT JOIN tb_common b ON b.COMM_CODE = a.AUTH_SQ
    AND b.COMM_GRP = 4 AND b.COMM_CODE > 0
    WHERE a.IS_DEL = 0 AND a.AUTH_SQ IS NULL
    ORDER BY a.MST_SQ DESC;
  `,
    []
  );

  if (error) return res.send(fail(errorMessage.db));

  res.send(success(result));
};

// 가입 요청자 수락
export const putMasterJoin = async (req: Request, res: Response) => {
  const MST_SQ = req?.params?.MST_SQ;
  const AUTH_SQ = req?.query?.AUTH_SQ ?? req?.body?.AUTH_SQ;
  const IS_OK = req?.query?.IS_OK ?? req?.body?.IS_OK;

  if (!useIsNumber(MST_SQ) || !useIsNumber(AUTH_SQ)) {
    return res.send(fail(errorMessage.parameter));
  }

  if (!Number(IS_OK)) {
    const { error } = await useDatabase(
      `
      DELETE FROM tb_master
      WHERE MST_SQ = ?;
    `,
      [MST_SQ]
    );

    if (error) return res.send(fail(errorMessage.db));

    res.send(success());
    return;
  }

  const { error } = await useDatabase(
    `
    UPDATE tb_master SET
    AUTH_SQ = ?, MST_JOIN_DT = NOW()
    WHERE MST_SQ = ?;
  `,
    [AUTH_SQ, MST_SQ]
  );

  if (error) return res.send(fail(errorMessage.db));

  res.send(success());
};

// 마스터 권한 변경
export const putMasterAuth = async (req: Request, res: Response) => {
  const MST_SQ = req?.params?.MST_SQ;
  const AUTH_SQ = req?.query?.AUTH_SQ ?? req?.body?.AUTH_SQ;

  if (!useIsNumber(MST_SQ) || !useIsNumber(AUTH_SQ)) {
    return res.send(fail(errorMessage.parameter));
  }

  const { error } = await useDatabase(
    `
    UPDATE tb_master SET
    AUTH_SQ = ?
    WHERE MST_SQ = ?;
  `,
    [AUTH_SQ, MST_SQ]
  );

  if (error) return res.send(fail(errorMessage.db));

  res.send(success());
};
