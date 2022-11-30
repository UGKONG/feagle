import { Request, Response } from "express";
import { fail, success, useDatabase, useIsNumber } from "../functions/utils";
import { errorMessage } from "../string";
import type { Device } from "../types";

// 조회 공통 쿼리
const deviceCommonQuery = `
  SELECT
  a.DEVICE_SQ, a.MDL_SQ, b.MDL_NM, b.MDL_EN_NM, b.MDL_DESC,
  a.SHOP_SQ, c.SHOP_NM, a.DEVICE_SN, a.DEVICE_NM, a.DEVICE_SW_VN, a.DEVICE_FW_VN,
  a.DEVICE_BUY_DT, a.DEVICE_INSTL_DT
  FROM tb_device a
  LEFT JOIN tb_device_model b ON b.MDL_SQ = a.MDL_SQ
  LEFT JOIN tb_shop c ON c.SHOP_SQ = a.SHOP_SQ
  WHERE a.IS_DEL = 0
`;

// 장비 리스트 조회
export const getDeviceList = async (req: Request, res: Response) => {
  const { error, result } = await useDatabase(deviceCommonQuery);

  if (error) return res.send(fail(errorMessage.db));
  res.send(success(result));
};

// 장비 상세정보 조회
export const getDeviceDetail = async (req: Request, res: Response) => {
  const DEVICE_SQ = req?.params?.DEVICE_SQ;
  if (!useIsNumber(DEVICE_SQ)) return res.send(fail(errorMessage.parameter));

  const { error, result } = await useDatabase(
    `
    ${deviceCommonQuery} AND a.DEVICE_SQ = ?
  `,
    [DEVICE_SQ]
  );

  if (error) return res.send(fail(errorMessage.db));
  if (!result[0]) return res.send(success(null));
  res.send(success(result[0]));
};

// 장비 추가
export const postDevice = async (req: Request, res: Response) => {
  const MDL_SQ = req?.query?.MDL_SQ ?? req?.body?.MDL_SQ;
  const SHOP_SQ = req?.query?.SHOP_SQ ?? req?.body?.SHOP_SQ;
  const DEVICE_SN = req?.query?.DEVICE_SN ?? req?.body?.DEVICE_SN;
  const DEVICE_NM = req?.query?.DEVICE_NM ?? req?.body?.DEVICE_NM;
  const DEVICE_SW_VN = req?.query?.DEVICE_SW_VN ?? req?.body?.DEVICE_SW_VN;
  const DEVICE_FW_VN = req?.query?.DEVICE_FW_VN ?? req?.body?.DEVICE_FW_VN;
  const DEVICE_BUY_DT = req?.query?.DEVICE_BUY_DT ?? req?.body?.DEVICE_BUY_DT;
  const DEVICE_INSTL_DT =
    req?.query?.DEVICE_INSTL_DT ?? req?.body?.DEVICE_INSTL_DT;

  // Validate
  const valid1 =
    MDL_SQ &&
    SHOP_SQ &&
    DEVICE_SN &&
    DEVICE_NM &&
    DEVICE_SW_VN &&
    DEVICE_FW_VN &&
    DEVICE_BUY_DT &&
    DEVICE_INSTL_DT;
  if (!valid1) return res.send(fail(errorMessage.parameter));
  const valid2 = DEVICE_BUY_DT?.length === 10 && DEVICE_INSTL_DT?.length === 10;
  if (!valid2) return res.send(fail(errorMessage.parameter));

  const { error } = await useDatabase(
    `
    INSERT INTO tb_device (
      MDL_SQ, SHOP_SQ, DEVICE_SN, DEVICE_NM, 
      DEVICE_SW_VN, DEVICE_FW_VN, DEVICE_BUY_DT, DEVICE_INSTL_DT
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?
    )
  `,
    [
      MDL_SQ,
      SHOP_SQ,
      DEVICE_SN,
      DEVICE_NM,
      DEVICE_SW_VN,
      DEVICE_FW_VN,
      DEVICE_BUY_DT,
      DEVICE_INSTL_DT,
    ]
  );
  if (error) return res.send(fail(errorMessage.db));
  res.send(success(null));
};

// 장비 정보 수정
export const putDevice = async (req: Request, res: Response) => {
  const DEVICE_SQ = req?.params?.DEVICE_SQ;
  const MDL_SQ = req?.query?.MDL_SQ ?? req?.body?.MDL_SQ;
  const SHOP_SQ = req?.query?.SHOP_SQ ?? req?.body?.SHOP_SQ;
  const DEVICE_SN = req?.query?.DEVICE_SN ?? req?.body?.DEVICE_SN;
  const DEVICE_NM = req?.query?.DEVICE_NM ?? req?.body?.DEVICE_NM;
  const DEVICE_SW_VN = req?.query?.DEVICE_SW_VN ?? req?.body?.DEVICE_SW_VN;
  const DEVICE_FW_VN = req?.query?.DEVICE_FW_VN ?? req?.body?.DEVICE_FW_VN;
  const DEVICE_BUY_DT = req?.query?.DEVICE_BUY_DT ?? req?.body?.DEVICE_BUY_DT;
  const DEVICE_INSTL_DT =
    req?.query?.DEVICE_INSTL_DT ?? req?.body?.DEVICE_INSTL_DT;

  // Validate
  const valid1 =
    DEVICE_SQ &&
    MDL_SQ &&
    SHOP_SQ &&
    DEVICE_SN &&
    DEVICE_NM &&
    DEVICE_SW_VN &&
    DEVICE_FW_VN &&
    DEVICE_BUY_DT &&
    DEVICE_INSTL_DT;
  if (!valid1) return res.send(fail(errorMessage.parameter));
  const valid2 = DEVICE_BUY_DT?.length === 10 && DEVICE_INSTL_DT?.length === 10;
  if (!valid2) return res.send(fail(errorMessage.parameter));

  const { error } = await useDatabase(
    `
    UPDATE tb_device SET
    MDL_SQ = ?, SHOP_SQ = ?, DEVICE_SN = ?, DEVICE_NM = ?, 
    DEVICE_SW_VN = ?, DEVICE_FW_VN = ?, DEVICE_BUY_DT = ?, DEVICE_INSTL_DT = ?
    WHERE DEVICE_SQ = ?
  `,
    [
      MDL_SQ,
      SHOP_SQ,
      DEVICE_SN,
      DEVICE_NM,
      DEVICE_SW_VN,
      DEVICE_FW_VN,
      DEVICE_BUY_DT,
      DEVICE_INSTL_DT,
      DEVICE_SQ,
    ]
  );
  if (error) return res.send(errorMessage.db);
  res.send(success(null));
};

// 장비 정보 삭제 (실제 업데이트)
export const deleteDevice = async (req: Request, res: Response) => {
  const DEVICE_SQ = req?.params?.DEVICE_SQ;
  if (!useIsNumber(DEVICE_SQ)) return res.send(fail(errorMessage.parameter));

  const { error } = await useDatabase(
    `
    UPDATE tb_device SET
    IS_DEL = 1
    WHERE DEVICE_SQ = ?
  `,
    [DEVICE_SQ]
  );
  if (error) return res.send(fail(errorMessage.db));
  res.send(success(null));
};
