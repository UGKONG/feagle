import { Request, Response } from "express";
import { success, fail, useIsNumber, useDatabase } from "../functions/utils";
import { errorMessage } from "../string";

// 모델 리스트 조회
export const getModelList = async (req: Request, res: Response) => {
  const { error, result } = await useDatabase(
    `
    SELECT
    MDL_SQ, MDL_NM, MDL_EN_NM, MDL_DESC
    FROM tb_device_model
    ORDER BY MDL_SQ DESC;
  `,
    []
  );

  if (error) return res.send(fail(errorMessage.db));

  res.send(success(result));
};
