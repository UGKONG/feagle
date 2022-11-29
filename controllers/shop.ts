import { Request, Response } from "express";
import { fail, success, useDatabase } from "../functions/utils";
import { errorMessage } from "../string";

// 피부샵 리스트 조회
export const getShopList = async (req: Request, res: Response) => {
  const { error, result } = await useDatabase(
    `
    SELECT
    SHOP_SQ, SHOP_NM, SHOP_NUM, SHOP_ADD
    FROM tb_shop
    WHERE IS_DEL <> 1;
  `,
    []
  );

  if (error) return res.send(fail(errorMessage.db));

  res.send(success(result));
};

// 피부샵 상세정보 조회
export const getShop = async (req: Request, res: Response) => {
  const SHOP_SQ = req?.params?.SHOP_SQ;

  if (isNaN(Number(SHOP_SQ))) return res.send(fail(errorMessage.parameter));

  const { error, result } = await useDatabase(
    `
    SELECT
    SHOP_SQ, SHOP_NM, SHOP_NUM, SHOP_ADD, IS_DEL
    FROM tb_shop
    WHERE SHOP_SQ = ?;

    SELECT
    MNG_SQ, MNG_NM, MNG_NUM, MNG_GD, MNG_ID, OS, UUID
    FROM tb_manager
    WHERE IS_DEL = 0
    AND SHOP_SQ = ?;

    SELECT
    a.DEVICE_SQ, a.MDL_SQ, b.MDL_NM, b.MDL_EN_NM, b.MDL_DESC,
    a.DEVICE_SN, a.DEVICE_NM, a.DEVICE_SW_VN, a.DEVICE_FW_VN,
    a.DEVICE_BUY_DT, a.DEVICE_INSTL_DT
    FROM tb_device a
    LEFT JOIN tb_device_model b ON b.MDL_SQ = a.MDL_SQ
    WHERE a.SHOP_SQ = ?;
  `,
    [SHOP_SQ, SHOP_SQ, SHOP_SQ]
  );

  if (error) return res.send(fail(errorMessage.db));

  let data = result[0][0];
  if (!data) return res.send(success(null));

  data = { ...data, MNG: result[1][0] ?? null, DEVICE: result[2] };
  res.send(success(data));
};

// 피부샵 추가
export const postShop = async (req: Request, res: Response) => {
  const SHOP_NM = req?.query?.SHOP_NM ?? req?.body?.SHOP_NM;
  const SHOP_NUM = req?.query?.SHOP_NUM ?? req?.body?.SHOP_NUM;
  const SHOP_ADD = req?.query?.SHOP_ADD ?? req?.body?.SHOP_ADD;
  const MNG_NM = req?.query?.MNG_NM ?? req?.body?.MNG_NM;
  const MNG_NUM = req?.query?.MNG_NUM ?? req?.body?.MNG_NUM;
  const MNG_GD = req?.query?.MNG_GD ?? req?.body?.MNG_GD;
  const MNG_ID = req?.query?.MNG_ID ?? req?.body?.MNG_ID;
  const MNG_PW = req?.query?.MNG_PW ?? req?.body?.MNG_PW;
  const DEVICE_LIST = req?.query?.DEVICE_LIST ?? req?.body?.DEVICE_LIST;
  let deviceSQL = "";

  const validate1 =
    !SHOP_NM ||
    !SHOP_NUM ||
    !SHOP_ADD ||
    !MNG_NM ||
    !MNG_NUM ||
    !MNG_GD ||
    !MNG_ID ||
    !MNG_PW;
  const validate2 =
    (DEVICE_LIST && !DEVICE_LIST[0]?.MDL_SQ) ||
    (DEVICE_LIST && !DEVICE_LIST[0]?.DEVICE_SN) ||
    (DEVICE_LIST && !DEVICE_LIST[0]?.DEVICE_BUY_DT) ||
    (DEVICE_LIST && !DEVICE_LIST[0]?.DEVICE_INSTL_DT);

  if (validate1 || validate2) return res.send(fail(errorMessage.parameter));

  if (DEVICE_LIST) {
    deviceSQL = `
      INSERT INTO tb_device (
        MDL_SQ, SHOP_SQ, DEVICE_SN, DEVICE_NM, DEVICE_BUY_DT, DEVICE_INSTL_DT
      ) VALUES 
      ${DEVICE_LIST?.map(
        (x: any) => `(
        '${x?.MDL_SQ}', @SHOP_SQ, '${x?.DEVICE_SN}', '${x?.DEVICE_SN}', 
        '${x?.DEVICE_BUY_DT}', '${x?.DEVICE_INSTL_DT}'
      )`
      ).join(", ")};
    `;
  }

  const { error } = await useDatabase(
    `
    INSERT INTO tb_shop (
      SHOP_NM, SHOP_NUM, SHOP_ADD
    ) VALUES (
      ?, ?, ?
    );

    SET @SHOP_SQ = LAST_INSERT_ID();

    INSERT INTO tb_manager (
      SHOP_SQ, MNG_NM, MNG_NUM, MNG_GD, MNG_ID, MNG_PW
    ) VALUES (
      @SHOP_SQ, ?, ?, ?, ?, ?
    );

    ${deviceSQL}
  `,
    [SHOP_NM, SHOP_NUM, SHOP_ADD, MNG_NM, MNG_NUM, MNG_GD, MNG_ID, MNG_PW]
  );

  if (error) return res.send(fail(errorMessage.db));

  res.send(success());
};

// 피부샵 활성화
export const postShopActivate = async (req: Request, res: Response) => {
  const SHOP_SQ = req?.params?.SHOP_SQ;

  if (isNaN(Number(SHOP_SQ))) return res.send(fail(errorMessage.parameter));

  const { error } = await useDatabase(
    `
    UPDATE tb_shop SET IS_DEL = 0 WHERE SHOP_SQ = ?;
  `,
    [SHOP_SQ]
  );

  if (error) return res.send(fail(errorMessage.db));

  res.send(success(null));
};

// 피부샵 정보 수정 (미완성)
export const putShop = async (req: Request, res: Response) => {
  const SHOP_SQ = req?.params?.SHOP_SQ;

  if (isNaN(Number(SHOP_SQ))) return res.send(fail(errorMessage.parameter));

  res.send(success("피부샵 정보 수정 {SHOP_SQ: " + SHOP_SQ + "}"));
};

// 피부샵 비활성화
export const deleteShop = async (req: Request, res: Response) => {
  const SHOP_SQ = req?.params?.SHOP_SQ;

  if (isNaN(Number(SHOP_SQ))) return res.send(fail(errorMessage.parameter));

  const { error } = await useDatabase(
    `
    UPDATE tb_shop SET IS_DEL = 1 WHERE SHOP_SQ = ?;
  `,
    [SHOP_SQ]
  );

  if (error) return res.send(fail(errorMessage.db));

  res.send(success(null));
};
