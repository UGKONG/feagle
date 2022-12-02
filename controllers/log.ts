import { Request, Response } from "express";
import { fail, success, useDatabase } from "../functions/utils";
import { errorMessage } from "../string";

// API 로그 리스트 조회
export const getApiLogList = async (req: Request, res: Response) => {
  const { error, result } = await useDatabase(
    `
    SELECT
    LOG_SQ, LOG_IP, LOG_METHOD, LOG_PATH, LOG_PARAMS, LOG_CRT_DT
    FROM tb_api_log
    ORDER BY LOG_SQ DESC;
  `,
    []
  );

  if (error) return res.send(fail(errorMessage.db));

  res.send(success(result));
};

// 다운로드 로그 리스트 조회
export const getDownloadLogList = async (req: Request, res: Response) => {
  const { error, result } = await useDatabase(
    `
    SELECT
    a.GET_SQ, b.FILE_SQ, b.FILE_HASH_NM, b.FILE_PATH, 
    b.FILE_HASH_NM, b.FILE_NM, b.FILE_SZ, b.FILE_EXT,
    c.POST_SQ, c.POST_TP, d.COMM_NM AS POST_TP_NM, c.MDL_SQ,
    e.MDL_NM, e.MDL_EN_NM, e.MDL_DESC, c.BUILD_VN,
    c.POST_TTL, c.POST_CN, c.MST_SQ, f.MST_NM, c.BUILD_DT,
    c.POST_CRT_DT, a.ACT_TP, g.COMM_NM AS ACT_TP_NM,
    a.ACT_SQ, a.ACT_NM, a.GET_CRT_DT
    FROM tb_get_log a
    LEFT JOIN tb_file b
      ON b.FILE_SQ = a.FILE_SQ
    LEFT JOIN tb_post c
      ON c.POST_SQ = b.POST_SQ
    LEFT JOIN tb_common d
      ON d.COMM_CODE = c.POST_TP
      AND d.COMM_GRP = 3
    LEFT JOIN tb_device_model e
      ON e.MDL_SQ = c.MDL_SQ
    LEFT JOIN tb_master f
      ON f.MST_SQ = c.MST_SQ
    LEFT JOIN tb_common g
      ON g.COMM_CODE = a.ACT_TP
      AND g.COMM_GRP = 2
    ORDER BY a.GET_SQ DESC;
  `,
    []
  );

  if (error) return res.send(fail(errorMessage.db));

  res.send(success(result));
};

// 로그 리스트 조회
export const getLogList = async (req: Request, res: Response) => {
  res.send(success([]));
};
