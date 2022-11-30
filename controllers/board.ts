import { Request, Response } from "express";
import { fail, success, useDatabase, useIsNumber } from "../functions/utils";
import { errorMessage } from "../string";

const commonSQL = `
  SELECT
  a.POST_SQ, a.POST_TP, b.COMM_NM AS POST_TP_NM,
  a.MDL_SQ, c.MDL_NM, c.MDL_EN_NM, c.MDL_DESC, 
  a.BUILD_VN, a.POST_TTL, a.POST_CN, a.MST_SQ,
  d.MST_NM, a.BUILD_DT, a.POST_CRT_DT
  FROM tb_post a
  LEFT JOIN tb_common b
    ON b.COMM_CODE = a.POST_TP
    AND b.COMM_GRP = 3
  LEFT JOIN tb_device_model c
    ON c.MDL_SQ = a.MDL_SQ
  LEFT JOIN tb_master d
    ON d.MST_SQ = a.MST_SQ
`;

// 자료, 펌웨어, 소프트웨어 리스트 조회
export const getBoardList = async (req: Request, res: Response) => {
  const POST_TP = req?.query?.POST_TP ?? req?.body?.POST_TP;

  const validate =
    POST_TP !== "post" &&
    POST_TP !== "ware" &&
    POST_TP !== "fw" &&
    POST_TP !== "sw";
  if (POST_TP && validate) return res.send(fail(errorMessage.parameter));

  let whereSQL = "";

  if (POST_TP === "post") {
    whereSQL = "WHERE a.POST_TP <> 4 AND a.POST_TP <> 5";
  } else if (POST_TP === "ware") {
    whereSQL = "WHERE a.POST_TP = 4 OR a.POST_TP = 5";
  } else if (POST_TP === "sw") {
    whereSQL = "WHERE a.POST_TP = 4";
  } else if (POST_TP === "fw") {
    whereSQL = "WHERE a.POST_TP = 5";
  }

  const { error, result } = await useDatabase(
    `
    ${commonSQL}
    ${whereSQL}
    ORDER BY a.POST_SQ DESC;
  `,
    []
  );

  if (error) return res.send(fail(errorMessage.db));

  res.send(success(result));
};

// 자료, 펌웨어, 소프트웨어 상세정보 조회
export const getBoardDetail = async (req: Request, res: Response) => {
  const POST_SQ = req?.params?.POST_SQ;
  if (!useIsNumber(POST_SQ)) return res.send(fail(errorMessage.parameter));

  const { error, result } = await useDatabase(
    `
    ${commonSQL}
    WHERE a.POST_SQ = ?;
  `,
    [POST_SQ]
  );

  if (error) return res.send(fail(errorMessage.db));

  res.send(success(result[0] ?? null));
};

// 자료, 펌웨어, 소프트웨어 추가
export const postBoard = async (req: any, res: Response) => {
  const POST_TP = req?.query?.POST_TP ?? req?.body?.POST_TP;
  const MDL_SQ = req?.query?.MDL_SQ ?? req?.body?.MDL_SQ;
  const BUILD_VN = req?.query?.BUILD_VN ?? req?.body?.BUILD_VN;
  const POST_TTL = req?.query?.POST_TTL ?? req?.body?.POST_TTL;
  const POST_CN = req?.query?.POST_CN ?? req?.body?.POST_CN;
  const BUILD_DT = req?.query?.BUILD_DT ?? req?.body?.BUILD_DT;
  const MST_SQ = req?.session?.user?.MST_SQ;

  if (!useIsNumber([POST_TP, MDL_SQ, MST_SQ])) {
    return res.send(fail(errorMessage.parameter));
  }

  const validate1 =
    !POST_TP ||
    !MDL_SQ ||
    !BUILD_VN ||
    !POST_TTL ||
    !POST_CN ||
    !BUILD_DT ||
    !MST_SQ;
  const validate2 = BUILD_DT?.length < 10;
  if (validate1 || validate2) {
    return res.send(fail(errorMessage.parameter));
  }

  const { error } = await useDatabase(
    `
    INSERT INTO tb_post (
      POST_TP, MDL_SQ, BUILD_VN, POST_TTL, POST_CN, MST_SQ, BUILD_DT
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?
    )
  `,
    [POST_TP, MDL_SQ, BUILD_VN, POST_TTL, POST_CN, MST_SQ, BUILD_DT]
  );

  if (error) return res.send(fail(errorMessage.db));

  res.send(success());
};

// 자료, 펌웨어, 소프트웨어 삭제
export const deleteBoard = async (req: Request, res: Response) => {
  const POST_SQ = req?.params?.POST_SQ;
  if (!useIsNumber(POST_SQ)) return res.send(fail(errorMessage.parameter));

  const { error } = await useDatabase(
    `
    DELETE FROM tb_post WHERE POST_SQ = ?;
  `,
    [POST_SQ]
  );

  if (error) return res.send(fail(errorMessage.db));

  res.send(success());
};
