import { Request, Response } from "express";
import { fail, success, useDatabase, useIsNumber } from "../functions/utils";
import { errorMessage } from "../string";

// 장비 조치 리스트 조회
export const getDeviceDoList = async (req: Request, res: Response) => {
  const DEVICE_SQ = req?.params?.DEVICE_SQ;
  if (!useIsNumber(DEVICE_SQ)) return res.send(fail(errorMessage.parameter));

  const { error, result } = await useDatabase(
    `
    SELECT
    a.DO_SQ, a.DO_CN, a.MST_SQ, b.MST_NM, b.MST_GRP, b.MST_PO, a.DO_CRT_DT
    FROM tb_device_do a
    LEFT JOIN tb_master b ON b.MST_SQ = a.MST_SQ
    WHERE a.DEVICE_SQ = ?
    ORDER BY a.DO_SQ ASC;
  `,
    [DEVICE_SQ]
  );

  if (error) return res.send(fail(errorMessage.db));
  res.send(success(result));
};

// 장비 조치 추가
export const postDeviceDo = async (req: Request, res: Response) => {
  const DEVICE_SQ = req?.body?.DEVICE_SQ;
  const DO_CN = req?.body?.DO_CN ?? "";
  const MST_SQ = req?.body?.MST_SQ;
  if (
    !useIsNumber(DEVICE_SQ) ||
    !useIsNumber(MST_SQ) ||
    !DEVICE_SQ ||
    !MST_SQ
  ) {
    return res.send(fail(errorMessage.parameter));
  }

  const { error } = await useDatabase(
    `
    INSERT INTO tb_device_do (
      DEVICE_SQ, DO_CN, MST_SQ
    ) VALUES (
      ?, ?, ?
    )
  `,
    [DEVICE_SQ, DO_CN, MST_SQ]
  );

  if (error) return res.send(fail(errorMessage.db));
  res.send(success());
};

// 장비 조치 삭제
export const deleteDeviceDo = async (req: Request, res: Response) => {
  const DO_SQ = req?.body?.DO_SQ;

  if (!useIsNumber(DO_SQ)) return res.send(fail(errorMessage.parameter));

  const { error } = await useDatabase(
    `
    DELETE FROM tb_device_do WHERE DO_SQ = ?;
  `,
    [DO_SQ]
  );

  if (error) return res.send(fail(errorMessage.db));
  res.send(success());
};
