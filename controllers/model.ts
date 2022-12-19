import { Request, Response } from "express";
import { success, fail, useIsNumber, useDatabase } from "../functions/utils";
import { errorMessage } from "../string";

// 모델 리스트 조회
export const getModelList = async (req: Request, res: Response) => {
  const { error, result } = await useDatabase(
    `
    SELECT
    MDL_SQ, MDL_NM, MDL_EN_NM, MDL_DESC, MDL_CRT_DT
    FROM tb_device_model
    ORDER BY MDL_SQ DESC;
  `,
    []
  );

  if (error) return res.send(fail(errorMessage.db));

  res.send(success(result));
};

// 모델 추가
export const postModel = async (req: Request, res: Response) => {
  const MDL_NM = req?.query?.MDL_NM ?? req?.body?.MDL_NM;
  const MDL_EN_NM = req?.query?.MDL_EN_NM ?? req?.body?.MDL_EN_NM;
  const MDL_DESC = req?.query?.MDL_DESC ?? req?.body?.MDL_DESC;

  if (!MDL_NM) return res.send(fail(errorMessage.parameter));

  const { error } = await useDatabase(
    `
    INSERT INTO tb_device_model (
      MDL_NM, MDL_EN_NM, MDL_DESC
    ) VALUES (
      ?, ?, ?
    );
  `,
    [MDL_NM, MDL_EN_NM, MDL_DESC]
  );

  if (error) return res.send(fail(errorMessage.db));

  res.send(success());
};

// 모델 편집
export const putModel = async (req: Request, res: Response) => {
  const MDL_SQ = req?.params?.MDL_SQ;
  const MDL_NM = req?.query?.MDL_NM ?? req?.body?.MDL_NM;
  const MDL_EN_NM = req?.query?.MDL_EN_NM ?? req?.body?.MDL_EN_NM;
  const MDL_DESC = req?.query?.MDL_DESC ?? req?.body?.MDL_DESC;

  if (!useIsNumber(MDL_SQ) || !MDL_NM) {
    return res.send(fail(errorMessage.parameter));
  }

  const { error } = await useDatabase(
    `
    UPDATE tb_device_model SET
    MDL_NM = ?, MDL_EN_NM = ?, MDL_DESC = ?
    WHERE MDL_SQ = ?;
  `,
    [MDL_NM, MDL_EN_NM, MDL_DESC, MDL_SQ]
  );

  if (error) return res.send(fail(errorMessage.db));

  res.send(success());
};

// 모델 삭제
export const deleteModel = async (req: Request, res: Response) => {
  const MDL_SQ = req?.params?.MDL_SQ;

  if (!useIsNumber(MDL_SQ)) {
    return res.send(fail(errorMessage.parameter));
  }

  const { error, result } = await useDatabase(
    `
    SELECT COUNT(*) AS COUNT FROM tb_device
    WHERE MDL_SQ = (
      SELECT MDL_SQ FROM tb_device_model WHERE MDL_SQ = ?
    );
  `,
    [MDL_SQ]
  );

  if (error) return res.send(fail(errorMessage.db));
  let count: number = result[0]?.COUNT ?? 0;
  if (count > 0) return res.send(fail("해당 모델에 속한 장비가 존재합니다."));

  const { error: error1 } = await useDatabase(
    `
    DELETE FROM tb_device_model WHERE MDL_SQ = ?;
  `,
    [MDL_SQ]
  );

  if (error1) return res.send(fail(errorMessage.db));

  res.send(success());
};
