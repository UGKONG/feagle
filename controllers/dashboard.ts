import type { Request, Response } from "express";
import { fail, success, useDatabase } from "../functions/utils";
import { errorMessage } from "../string";
import { Address } from "../types";

type IsTrue = 0 | 1;
type Device = {
  DEVICE_SQ: number;
  SHOP_SQ: number;
  SHOP_ADD_SQ: number;
  IS_ON: IsTrue;
  IS_START: IsTrue;
  USE_TIME: number;
  USE_COUNT: number;
  IS_GAS_DANGER: IsTrue;
  IS_PLA_DANGER: IsTrue;
};
type AddressResult = [Address[], Device[]];
export type AddressData = {
  ADDR_SQ: number;
  ADDR_NM: string;
  SHOP_COUNT: number;
  DEVICE_COUNT: number;
  USE_COUNT: number;
  USE_TIME: number;
  ON_COUNT: number;
  START_COUNT: number;
  GAS_DANGER_COUNT: number;
  PLA_DANGER_COUNT: number;
};

const commonSQL = `
  SELECT
  a.DEVICE_SQ,
  b.SHOP_SQ,
  b.SHOP_ADD_SQ,
  b.SHOP_NM,
  IF(c.IS_ON > 0, 1, 0) AS IS_ON,
  IF(d.IS_START > 0, 1, 0) AS IS_START,
  IF(e.UDD_VAL > 0, e.UDD_VAL, 0) AS USE_TIME,
  IF(f.COUNT > 0, f.COUNT, 0) AS USE_COUNT,
  IF(i.REF_MIN <= g.UDD_VAL AND g.UDD_VAL <= i.REF_MAX, 1, 0) AS IS_GAS_DANGER,
  IF(j.REF_MIN <= h.UDD_VAL AND h.UDD_VAL <= j.REF_MAX, 1, 0) AS IS_PLA_DANGER
  FROM tb_device a
  # 장비를 보유한 피부샵 정보 조회
  RIGHT JOIN tb_shop b
    ON b.SHOP_SQ = a.SHOP_SQ
  # 장비 켜짐 여부 조회
  LEFT JOIN (
    SELECT DEVICE_SQ, 1 AS IS_ON
    FROM tb_alive_device
    WHERE AL_OFF IS NULL
  ) c ON c.DEVICE_SQ = a.DEVICE_SQ
  # 장비 시작 여부 조회
  LEFT JOIN (
    SELECT DEVICE_SQ, 1 AS IS_START
    FROM tb_use_device
    WHERE UD_END IS NULL
  ) d ON d.DEVICE_SQ = a.DEVICE_SQ
  # 장비 누적 사용 시간 조회
  LEFT JOIN (
    SELECT DEVICE_SQ, UDD_VAL
    FROM tb_use_device_data
    WHERE UDD_TP = 4
    ORDER BY UDD_SQ DESC
    LIMIT 1
  ) e ON e.DEVICE_SQ = a.DEVICE_SQ
  # 장비 누적 사용 횟수 조회
  LEFT JOIN (
    SELECT DEVICE_SQ, COUNT(DEVICE_SQ) AS COUNT
    FROM tb_use_device
    GROUP BY DEVICE_SQ
  ) f ON f.DEVICE_SQ = a.DEVICE_SQ
  # 장비 가스 잔량 조회
  LEFT JOIN (
    SELECT DEVICE_SQ, UDD_VAL
    FROM tb_use_device_data
    WHERE UDD_TP = 1
    ORDER BY UDD_SQ DESC
    LIMIT 1
  ) g ON g.DEVICE_SQ = a.DEVICE_SQ
  # 장비 플라즈마 전류 조회
  LEFT JOIN (
    SELECT DEVICE_SQ, UDD_VAL
    FROM tb_use_device_data
    WHERE UDD_TP = 5
    ORDER BY UDD_SQ DESC
    LIMIT 1
  ) h ON h.DEVICE_SQ = a.DEVICE_SQ
  # 가스 잔량 위험 범위 조회 (MIN, MAX)
  LEFT JOIN tb_model_danger_reference i
    ON i.MDL_SQ = a.MDL_SQ
    AND i.REF_TP = 1
  # 플라즈마 전류 위험 범위 조회 (MIN, MAX)
  LEFT JOIN tb_model_danger_reference j
    ON j.MDL_SQ = a.MDL_SQ
    AND j.REF_TP = 5
  GROUP BY a.DEVICE_SQ;
`;

// 지역 별 장비 통계
export const getAddressList = async (req: Request, res: Response) => {
  const SQL = `
    # 주소 리스트 조회
    SELECT
    COMM_CODE AS ADDR_SQ,
    COMM_NM AS ADDR_NM
    FROM tb_common WHERE COMM_GRP = 7
    ORDER BY COMM_CODE;

    # 장비 리스트 조회
    ${commonSQL}
  `;

  const { error, result } = await useDatabase(SQL, []);

  if (error) return res.send(fail(errorMessage.db));

  const [addressList, deviceList]: AddressResult = result;

  const data: AddressData[] = addressList?.map((addr) => {
    let ADDR_SQ = addr.ADDR_SQ;
    let ADDR_NM = addr.ADDR_NM;
    let list = deviceList?.filter((x) => x?.SHOP_ADD_SQ === ADDR_SQ);

    let SHOP_LIST: number[] = [];
    let SHOP_COUNT: number = 0;
    let DEVICE_COUNT: number = 0;
    let USE_COUNT: number = 0;
    let USE_TIME: number = 0;
    let ON_COUNT: number = 0;
    let START_COUNT: number = 0;
    let GAS_DANGER_COUNT: number = 0;
    let PLA_DANGER_COUNT: number = 0;

    list?.forEach((item) => {
      if (SHOP_LIST?.indexOf(item?.SHOP_SQ) === -1) {
        SHOP_LIST.push(item?.SHOP_SQ);
        SHOP_COUNT += 1;
      }
      DEVICE_COUNT += 1;
      USE_COUNT += item?.USE_COUNT;
      USE_TIME += item?.USE_TIME;
      ON_COUNT += item?.IS_ON;
      START_COUNT += item?.IS_START;
      GAS_DANGER_COUNT += item?.IS_GAS_DANGER;
      PLA_DANGER_COUNT += item?.IS_PLA_DANGER;
    });

    return {
      ADDR_SQ,
      ADDR_NM,
      SHOP_COUNT,
      DEVICE_COUNT,
      USE_COUNT,
      USE_TIME,
      ON_COUNT,
      START_COUNT,
      GAS_DANGER_COUNT,
      PLA_DANGER_COUNT,
    };
  });

  res.send(success(data));
};

type Shop = {
  SHOP_SQ: number;
  SHOP_NM: string;
};
export type ShopData = {
  SHOP_SQ: number;
  SHOP_NM: string;
  DEVICE_COUNT: number;
  USE_COUNT: number;
  USE_TIME: number;
  ON_COUNT: number;
  START_COUNT: number;
  GAS_DANGER_COUNT: number;
  PLA_DANGER_COUNT: number;
};
type ShopResult = [Shop[], Device[]];

// 해당 피부샵에 대한 장비 통계
export const getShopList = async (req: Request, res: Response) => {
  const ADDR_SQ = req?.params?.ADDR_SQ;

  const SQL = `
    # 피부샵 리스트 조회
    SELECT
    SHOP_SQ,
    SHOP_NM
    FROM tb_shop WHERE SHOP_ADD_SQ = ?
    ORDER BY SHOP_SQ;

    ${commonSQL}
  `;
  const { error, result } = await useDatabase(SQL, [ADDR_SQ]);

  if (error) return res.send(fail(errorMessage.db));

  const [shopList, deviceList]: ShopResult = result;

  const data: ShopData[] = shopList?.map((shop: Shop) => {
    let SHOP_SQ = shop.SHOP_SQ;
    let SHOP_NM = shop.SHOP_NM;
    let list = deviceList?.filter((x) => x?.SHOP_SQ === SHOP_SQ);

    let DEVICE_COUNT: number = 0;
    let USE_COUNT: number = 0;
    let USE_TIME: number = 0;
    let ON_COUNT: number = 0;
    let START_COUNT: number = 0;
    let GAS_DANGER_COUNT: number = 0;
    let PLA_DANGER_COUNT: number = 0;

    list?.forEach((item) => {
      DEVICE_COUNT += 1;
      USE_COUNT += item?.USE_COUNT;
      USE_TIME += item?.USE_TIME;
      ON_COUNT += item?.IS_ON;
      START_COUNT += item?.IS_START;
      GAS_DANGER_COUNT += item?.IS_GAS_DANGER;
      PLA_DANGER_COUNT += item?.IS_PLA_DANGER;
    });

    return {
      SHOP_SQ,
      SHOP_NM,
      DEVICE_COUNT,
      USE_COUNT,
      USE_TIME,
      ON_COUNT,
      START_COUNT,
      GAS_DANGER_COUNT,
      PLA_DANGER_COUNT,
    };
  });

  res.send(success(data));
};
