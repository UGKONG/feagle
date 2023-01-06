import { Request, Response } from "express";
import sha256 from "sha256";
import { fail, success, useDatabase, useIsNumber } from "../functions/utils";
import { errorMessage } from "../string";
import { OrNull } from "../types";

type ShopList = Array<{
  SHOP_SQ: OrNull<number>;
  SHOP_NM: OrNull<string>;
  SHOP_NUM: OrNull<string>;
  SHOP_ADD: OrNull<string>;
  MNG_NM: OrNull<string>;
  SHOP_CRT_DT: OrNull<string>;
  DEVICE_COUNT: number;
}>;
type AliveList = Array<{
  DEVICE_SQ: number;
  SHOP_SQ: number;
}>;

// 피부샵 리스트 조회
export const getShopList = async (req: Request, res: Response) => {
  const { error, result } = await useDatabase(
    `
    SELECT
    a.SHOP_SQ, a.SHOP_NM, a.SHOP_NUM, a.SHOP_ADD, a.SHOP_ADD_DTL,
    b.MNG_NM, a.SHOP_CRT_DT, 
    IF(c.DEVICE_COUNT > 0, c.DEVICE_COUNT, 0) AS DEVICE_COUNT,
    d.COMM_NM AS SHOP_ADD_NM
    FROM tb_shop a
    LEFT JOIN tb_manager b ON b.SHOP_SQ = a.SHOP_SQ
    LEFT JOIN (
      SELECT SHOP_SQ, COUNT(*) AS DEVICE_COUNT FROM tb_device GROUP BY SHOP_SQ
    ) c ON c.SHOP_SQ = a.SHOP_SQ
    LEFT JOIN tb_common d
      ON d.COMM_CODE = a.SHOP_ADD_SQ
      AND d.COMM_GRP = 7
    ORDER BY a.SHOP_SQ DESC;

    SELECT
    b.DEVICE_SQ, b.SHOP_SQ FROM tb_alive_device a
    LEFT JOIN tb_device b ON b.DEVICE_SQ = a.DEVICE_SQ
    WHERE (a.AL_ON <= NOW() AND a.AL_OFF IS NULL)
    OR (a.AL_ON <= NOW() AND a.AL_ALIVE IS NOT NULL AND a.AL_OFF IS NULL);
  `,
    []
  );

  if (error) return res.send(fail(errorMessage.db));

  let [shopList, aliveList]: [ShopList, AliveList] = result;

  shopList = shopList?.map((item) => {
    let filter = aliveList?.filter((x) => x?.SHOP_SQ === item?.SHOP_SQ);
    return { ...item, ACTIVE_COUNT: filter?.length };
  });

  res.send(success(shopList));
};

// 피부샵 상세정보 조회
export const getShop = async (req: Request, res: Response) => {
  const SHOP_SQ = req?.params?.SHOP_SQ;

  if (!useIsNumber(SHOP_SQ)) return res.send(fail(errorMessage.parameter));

  const { error, result } = await useDatabase(
    `
    SELECT
    SHOP_SQ, SHOP_NM, SHOP_NUM, SHOP_ADD, SHOP_ADD_DTL, IS_DEL
    FROM tb_shop
    WHERE SHOP_SQ = ?;

    SELECT
    MNG_SQ, MNG_NM, MNG_NUM, MNG_GD, MNG_ID, OS, UUID
    FROM tb_manager
    WHERE IS_DEL = 0
    AND SHOP_SQ = ?
    LIMIT 1;

    SELECT
    a.DEVICE_SQ, a.MDL_SQ, b.MDL_NM, b.MDL_EN_NM, b.MDL_DESC, b.MDL_IMG_NM,
    a.SHOP_SQ, c.SHOP_NM, a.DEVICE_SN, a.DEVICE_NM, a.DEVICE_SW_VN, a.DEVICE_FW_VN,
    a.DEVICE_BUY_DT, a.DEVICE_INSTL_DT, d.UDD_VAL AS USE_TM_VAL, h.UDD_VAL AS GAS_VAL,
    IF(e.IS_ACTIVE, e.IS_ACTIVE, 0) AS IS_ACTIVE, IF(f.ON_COUNT, f.ON_COUNT, 0) AS ON_COUNT,
    a.DEVICE_LAST_DT, g.UDD_VAL AS PLA_VAL
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
      GROUP BY DEVICE_SQ
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
    AND a.SHOP_SQ = ?
    ORDER BY a.DEVICE_SQ DESC;

    SELECT 
    a.UDD_SQ, a.UDD_TP, a.UDD_VAL, a.UDD_CRT_DT,
    c.MDL_NM, b.DEVICE_SN
    FROM tb_use_device_data a
    LEFT JOIN tb_device b
      ON b.DEVICE_SQ = a.DEVICE_SQ
    LEFT JOIN tb_device_model c
      ON c.MDL_SQ = b.MDL_SQ
    WHERE a.DEVICE_SQ IN (
      SELECT DEVICE_SQ FROM tb_device WHERE SHOP_SQ = ?
    );
  `,
    [SHOP_SQ, SHOP_SQ, SHOP_SQ, SHOP_SQ]
  );

  if (error) return res.send(fail(errorMessage.db));

  let data = result[0][0];
  if (!data) return res.send(success(null));
  let history = result[3];

  history = history?.map((item: any) => {
    let tp = item?.UDD_TP;
    let val = item?.UDD_VAL;
    let txt = "";
    let sn = item?.DEVICE_SN ?? "-";
    let nm = item?.MDL_NM;

    if (tp === 1) {
      txt = `${sn} (모델명:${nm}) 장비의 가스 잔량이 ${val}% 남았습니다.`;
    } else if (tp === 2) {
      txt = `${sn} (모델명:${nm}) 장비의 가스 얍력이 ${val}㎫ 입니다.`;
    } else if (tp === 3) {
      txt = `${sn} (모델명:${nm}) 장비의 가스 유량이 ${val}ℓ/hr 입니다.`;
    } else if (tp === 4) {
      txt = `${sn} (모델명:${nm}) 장비의 누적 사용시간이 ${val} 입니다.`;
    } else if (tp === 5) {
      txt = `${sn} (모델명:${nm}) 장비의 플라즈마 전류가 ${val}㎃ 입니다.`;
    }

    return {
      UDD_SQ: item?.UDD_SQ,
      UDD_TXT: txt,
      UDD_CRT_DT: item?.UDD_CRT_DT,
      DEVICE_SN: item?.DEVICE_SN,
      MDL_NM: item?.MDL_NM,
    };
  });

  data = {
    ...data,
    MNG: result[1][0] ?? null,
    DEVICE: result[2],
    HISTORY: history,
  };
  res.send(success(data));
};

// 피부샵 추가
export const postShop = async (req: Request, res: Response) => {
  const SHOP_NM = req?.query?.SHOP_NM ?? req?.body?.SHOP_NM;
  const SHOP_NUM = req?.query?.SHOP_NUM ?? req?.body?.SHOP_NUM;
  const SHOP_ADD = req?.query?.SHOP_ADD ?? req?.body?.SHOP_ADD;
  const ADDR_TEXT = SHOP_ADD?.split(" ")[0];
  const SHOP_ADD_DTL = req?.query?.SHOP_ADD_DTL ?? req?.body?.SHOP_ADD_DTL;
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
    (DEVICE_LIST?.length && !DEVICE_LIST[0]?.MDL_SQ) ||
    (DEVICE_LIST?.length && !DEVICE_LIST[0]?.DEVICE_SN) ||
    (DEVICE_LIST?.length && !DEVICE_LIST[0]?.DEVICE_BUY_DT) ||
    (DEVICE_LIST?.length && !DEVICE_LIST[0]?.DEVICE_INSTL_DT);
  console.log(validate1, validate2);
  if (validate1 || validate2) return res.send(fail(errorMessage.parameter));

  const { error: error1, result } = await useDatabase(
    `
    SELECT COUNT(*) AS COUNT FROM tb_manager
    WHERE MNG_ID = ?;
  `,
    [MNG_ID]
  );

  if (error1) return res.send(fail(errorMessage.db));
  if (result[0]?.COUNT > 0) {
    return res.send(fail("아이디가 중복됩니다."));
  }

  if (DEVICE_LIST?.length) {
    deviceSQL = `
      INSERT INTO tb_device (
        MDL_SQ, SHOP_SQ, DEVICE_SN, DEVICE_NM, DEVICE_BUY_DT, DEVICE_INSTL_DT
      ) VALUES ${DEVICE_LIST?.map(
        (x: any) => `(
        '${x?.MDL_SQ}', @SHOP_SQ, '${x?.DEVICE_SN}', '${x?.DEVICE_SN}', 
        '${x?.DEVICE_BUY_DT}', '${x?.DEVICE_INSTL_DT}'
      )`
      ).join(", ")};
    `;
  }

  const { error: error2 } = await useDatabase(
    `
    
    INSERT INTO tb_shop (
      SHOP_NM, SHOP_NUM, SHOP_ADD_SQ, SHOP_ADD, SHOP_ADD_DTL
    ) SELECT ?, ?, COMM_CODE, ?, ? 
      FROM tb_common WHERE COMM_GRP = 7 
      AND COMM_NM = ?;

    SET @SHOP_SQ = LAST_INSERT_ID();

    INSERT INTO tb_manager (
      SHOP_SQ, MNG_NM, MNG_NUM, MNG_GD, MNG_ID, MNG_PW
    ) VALUES (
      @SHOP_SQ, ?, ?, ?, ?, ?
    );

    ${deviceSQL}
  `,
    [
      SHOP_NM,
      SHOP_NUM,
      SHOP_ADD,
      SHOP_ADD_DTL,
      ADDR_TEXT,
      MNG_NM,
      MNG_NUM,
      MNG_GD,
      MNG_ID,
      sha256(MNG_PW),
    ]
  );

  if (error2) return res.send(fail(errorMessage.db));

  res.send(success());
};

// 피부샵 활성화
export const postShopActivate = async (req: Request, res: Response) => {
  const SHOP_SQ = req?.params?.SHOP_SQ;
  if (!useIsNumber(SHOP_SQ)) return res.send(fail(errorMessage.parameter));

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
  if (!useIsNumber(SHOP_SQ)) return res.send(fail(errorMessage.parameter));

  const SHOP_NM = req?.query?.SHOP_NM ?? req?.body?.SHOP_NM;
  const SHOP_NUM = req?.query?.SHOP_NUM ?? req?.body?.SHOP_NUM;
  const SHOP_ADD = req?.query?.SHOP_ADD ?? req?.body?.SHOP_ADD;
  const ADDR_TEXT = SHOP_ADD?.split(" ")[0];
  const SHOP_ADD_DTL = req?.query?.SHOP_ADD_DTL ?? req?.body?.SHOP_ADD_DTL;

  const validate = !SHOP_NM || !SHOP_NUM || !SHOP_ADD;
  if (validate) return res.send(fail(errorMessage.parameter));

  const { error } = await useDatabase(
    `
    SET @ADDR_SQ = (
      SELECT COMM_CODE FROM tb_common 
      WHERE COMM_GRP = 7 AND COMM_NM = ?
    );

    UPDATE tb_shop SET
    SHOP_NM = ?, SHOP_NUM = ?, SHOP_ADD_SQ = @ADDR_SQ, 
    SHOP_ADD = ?, SHOP_ADD_DTL = ?
    WHERE SHOP_SQ = ?;
  `,
    [ADDR_TEXT, SHOP_NM, SHOP_NUM, SHOP_ADD, SHOP_ADD_DTL, SHOP_SQ]
  );

  if (error) return res.send(fail(errorMessage.db));

  res.send(success());
};

// 피부샵 비활성화
export const deleteShop = async (req: Request, res: Response) => {
  const SHOP_SQ = req?.params?.SHOP_SQ;
  if (!useIsNumber(SHOP_SQ)) return res.send(fail(errorMessage.parameter));

  const { error } = await useDatabase(
    `
    UPDATE tb_shop SET IS_DEL = 1 WHERE SHOP_SQ = ?;
  `,
    [SHOP_SQ]
  );

  if (error) return res.send(fail(errorMessage.db));

  res.send(success(null));
};
