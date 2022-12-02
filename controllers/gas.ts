import { Request, Response } from "express";
import { success, fail, useIsNumber, useDatabase } from "../functions/utils";
import { errorMessage } from "../string";

// 가스 주문 리스트 조회
export const getGasRequestList = async (req: Request, res: Response) => {
  const { error, result } = await useDatabase(
    `
    SELECT
    a.GR_SQ, a.SHOP_SQ, b.SHOP_NM, a.IS_CHK,
    a.GR_MOD_DT, a.GR_CRT_DT
    FROM tb_gas_req a
    LEFT JOIN tb_shop b
      ON b.SHOP_SQ = a.SHOP_SQ
    ORDER BY a.GR_SQ DESC;
  `,
    []
  );

  if (error) return res.send(fail(errorMessage.db));

  res.send(success(result));
};

// 가스 주문
export const postGasRequest = async (req: Request, res: Response) => {
  const SHOP_SQ = req?.query?.SHOP_SQ ?? req?.body?.SHOP_SQ;
  if (!useIsNumber(SHOP_SQ)) return res.send(fail(errorMessage.parameter));

  const { error } = await useDatabase(
    `
    INSERT INTO tb_gas_req (SHOP_SQ) VALUES (?);
  `,
    [SHOP_SQ]
  );

  if (error) return res.send(fail(errorMessage.db));

  res.send(success());
};

// 가스 주문건 확인
export const putGasRequestCheck = async (req: Request, res: Response) => {
  const GR_SQ = req?.params?.GR_SQ;
  if (!useIsNumber(GR_SQ)) return res.send(fail(errorMessage.parameter));

  const { error } = await useDatabase(
    `
    UPDATE tb_gas_req SET
    IS_CHK = 1
    WHERE GR_SQ = ?;
  `,
    [GR_SQ]
  );

  if (error) return res.send(fail(errorMessage.db));

  res.send(success());
};
