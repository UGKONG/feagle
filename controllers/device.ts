import { Request, Response } from "express";
import { fail, success, useDatabase, useIsNumber } from "../functions/utils";
import { errorMessage } from "../string";

// 장비 리스트 조회
export const getDeviceList = async (req: Request, res: Response) => {
  const { error, result } = await useDatabase(`
    SELECT
    a.DEVICE_SQ, a.MDL_SQ, b.MDL_NM, b.MDL_EN_NM, b.MDL_DESC,
    a.SHOP_SQ, c.SHOP_NM, a.DEVICE_SN, a.DEVICE_NM, a.DEVICE_SW_VN, a.DEVICE_FW_VN,
    a.DEVICE_BUY_DT, a.DEVICE_INSTL_DT, d.UDD_VAL AS USE_TM_VAL,
    h.UDD_VAL AS GAS_VAL, IF(e.IS_ACTIVE, e.IS_ACTIVE, 0) AS IS_ACTIVE, 
    f.ON_COUNT AS ON_COUNT, a.DEVICE_LAST_DT, 
    g.UDD_VAL AS PLA_VAL
    FROM tb_device a
    LEFT JOIN tb_device_model b ON b.MDL_SQ = a.MDL_SQ
    LEFT JOIN tb_shop c ON c.SHOP_SQ = a.SHOP_SQ
    LEFT JOIN (
      SELECT DEVICE_SQ, MAX(UDD_VAL) AS UDD_VAL
      FROM tb_use_device_data
      WHERE UDD_TP = 4
      GROUP BY DEVICE_SQ
    ) d ON d.DEVICE_SQ = a.DEVICE_SQ
    LEFT JOIN (
      SELECT DEVICE_SQ, 1 AS IS_ACTIVE
      FROM tb_alive_device
      WHERE AL_OFF IS NULL
    ) e ON e.DEVICE_SQ = a.DEVICE_SQ
    LEFT JOIN (
      SELECT DEVICE_SQ, COUNT(DEVICE_SQ) AS ON_COUNT
      FROM tb_alive_device
      GROUP BY DEVICE_SQ
    ) f ON f.DEVICE_SQ = a.DEVICE_SQ
    LEFT JOIN (
      SELECT DEVICE_SQ, MAX(UDD_VAL) AS UDD_VAL
      FROM tb_use_device_data
      WHERE UDD_TP = 5
      GROUP BY DEVICE_SQ
    ) g ON g.DEVICE_SQ = a.DEVICE_SQ
    LEFT JOIN (
      SELECT DEVICE_SQ, MAX(UDD_VAL) AS UDD_VAL
      FROM tb_use_device_data
      WHERE UDD_TP = 1
      GROUP BY DEVICE_SQ
    ) h ON h.DEVICE_SQ = a.DEVICE_SQ
    WHERE a.IS_DEL = 0
    ORDER BY a.DEVICE_SQ DESC;
  `);

  if (error) return res.send(fail(errorMessage.db));
  res.send(success(result));
};

// 장비 상세정보 조회
export const getDeviceDetail = async (req: Request, res: Response) => {
  const DEVICE_SQ = req?.params?.DEVICE_SQ;
  if (!useIsNumber(DEVICE_SQ)) return res.send(fail(errorMessage.parameter));

  const { error, result } = await useDatabase(
    `
    SELECT
    a.DEVICE_SQ, a.MDL_SQ, b.MDL_NM, b.MDL_EN_NM, b.MDL_DESC,
    a.SHOP_SQ, c.SHOP_NM, c.SHOP_NUM, c.SHOP_ADD, a.DEVICE_SN, a.DEVICE_NM, a.DEVICE_SW_VN, a.DEVICE_FW_VN,
    a.DEVICE_BUY_DT, a.DEVICE_INSTL_DT, IF(d.UDD_VAL, d.UDD_VAL, 0) AS UDD_VAL,
    IF(e.IS_ACTIVE, e.IS_ACTIVE, 0) AS IS_ACTIVE, IF(f.ON_COUNT, f.ON_COUNT, 0) AS ON_COUNT,
    a.DEVICE_LAST_DT, g.UDD_VAL AS PLA_VAL, h.UDD_VAL AS GAS_VAL, i.UDD_VAL AS GAS1_VAL,
    j.UDD_VAL AS GAS2_VAL
    FROM tb_device a
    LEFT JOIN tb_device_model b ON b.MDL_SQ = a.MDL_SQ
    LEFT JOIN tb_shop c ON c.SHOP_SQ = a.SHOP_SQ
    LEFT JOIN (
      SELECT DEVICE_SQ, MAX(UDD_VAL) AS UDD_VAL
      FROM tb_use_device_data
      WHERE UDD_TP = 4
      GROUP BY DEVICE_SQ
    ) d ON d.DEVICE_SQ = a.DEVICE_SQ
    LEFT JOIN (
      SELECT DEVICE_SQ, 1 AS IS_ACTIVE
      FROM tb_alive_device
      WHERE AL_OFF IS NULL
    ) e ON e.DEVICE_SQ = a.DEVICE_SQ
    LEFT JOIN (
      SELECT DEVICE_SQ, COUNT(DEVICE_SQ) AS ON_COUNT
      FROM tb_alive_device
      GROUP BY DEVICE_SQ
    ) f ON f.DEVICE_SQ = a.DEVICE_SQ
    LEFT JOIN (
      SELECT DEVICE_SQ, MAX(UDD_VAL) AS UDD_VAL
      FROM tb_use_device_data
      WHERE UDD_TP = 5
      GROUP BY DEVICE_SQ
    ) g ON g.DEVICE_SQ = a.DEVICE_SQ
    LEFT JOIN (
      SELECT DEVICE_SQ, MAX(UDD_VAL) AS UDD_VAL
      FROM tb_use_device_data
      WHERE UDD_TP = 1
      GROUP BY DEVICE_SQ
    ) h ON h.DEVICE_SQ = a.DEVICE_SQ
    LEFT JOIN (
      SELECT DEVICE_SQ, MAX(UDD_VAL) AS UDD_VAL
      FROM tb_use_device_data
      WHERE UDD_TP = 2
      GROUP BY DEVICE_SQ
    ) i ON h.DEVICE_SQ = a.DEVICE_SQ
    LEFT JOIN (
      SELECT DEVICE_SQ, MAX(UDD_VAL) AS UDD_VAL
      FROM tb_use_device_data
      WHERE UDD_TP = 3
      GROUP BY DEVICE_SQ
    ) j ON h.DEVICE_SQ = a.DEVICE_SQ
    WHERE a.IS_DEL = 0
    AND a.DEVICE_SQ = ?;

    SELECT 
    a.UDD_SQ, a.UDD_TP, a.UDD_VAL, a.UDD_CRT_DT
    FROM tb_use_device_data a
    WHERE DEVICE_SQ = ?;
  `,
    [DEVICE_SQ, DEVICE_SQ]
  );

  if (error) return res.send(fail(errorMessage.db));

  let data = result[0][0];
  if (!data) return res.send(success(null));
  let history = result[1];

  history = history?.map((item: any) => {
    let tp = item?.UDD_TP;
    let val = item?.UDD_VAL;
    let txt = "";

    if (tp === 1) {
      txt = `가스 잔량이 ${val}% 남았습니다.`;
    } else if (tp === 2) {
      txt = `가스 얍력이 ${val}㎫ 입니다.`;
    } else if (tp === 3) {
      txt = `가스 유량이 ${val}ℓ/hr 입니다.`;
    } else if (tp === 4) {
      txt = `누적 사용시간이 ${val} 입니다.`;
    } else if (tp === 5) {
      txt = `플라즈마 전류가 ${val}㎃ 입니다.`;
    }

    return { UDD_SQ: item?.UDD_SQ, UDD_TXT: txt, UDD_CRT_DT: item?.UDD_CRT_DT };
  });

  data = {
    ...data,
    HISTORY: history,
  };
  res.send(success(data));
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

// 피부샵에 장비 추가
export const postShopDevice = async (req: Request, res: Response) => {
  const SHOP_SQ = req?.params?.SHOP_SQ;
  const DEVICE_LIST = req?.query?.DEVICE_LIST ?? req?.body?.DEVICE_LIST;
  if (!useIsNumber(SHOP_SQ)) return res.send(fail(errorMessage.parameter));

  const { error, sql } = await useDatabase(
    `
    INSERT INTO tb_device (
      MDL_SQ, SHOP_SQ, DEVICE_SN, DEVICE_NM, DEVICE_BUY_DT, DEVICE_INSTL_DT
    ) VALUES ${DEVICE_LIST?.map(
      (x: any) => `(
      '${x?.MDL_SQ}', '${SHOP_SQ}', '${x?.DEVICE_SN}', '${x?.DEVICE_SN}', 
      '${x?.DEVICE_BUY_DT}', '${x?.DEVICE_INSTL_DT}'
    )`
    ).join(", ")};
  `,
    []
  );

  console.log(sql);

  if (error) return res.send(fail(errorMessage.db));

  res.send(success());
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
