import { Request, Response } from "express";
import { fail, success, useDatabase } from "../functions/utils";
import { errorMessage } from "../string";
import fs from "fs";

// 신규 버전 정보 조회 (서버 -> 장비)
export const getNewVersion = async (req: Request, res: Response) => {
  const DEVICE_SN = req?.query?.DEVICE_SN ?? req?.body?.DEVICE_SN;
  if (!DEVICE_SN) return res.send(fail(errorMessage.parameter));

  const { error, result } = await useDatabase(
    `
    SET @MDL_SQ = (SELECT MDL_SQ FROM tb_device WHERE DEVICE_SN = ? LIMIT 1);

    # 소프트웨어
    SELECT MAX(BUILD_VN) AS VN FROM tb_post WHERE MDL_SQ = @MDL_SQ AND POST_TP = 4;

    # 펌웨어
    SELECT MAX(BUILD_VN) AS VN FROM tb_post WHERE MDL_SQ = @MDL_SQ AND POST_TP = 5;
  `,
    [DEVICE_SN]
  );

  if (error) return res.send(fail(errorMessage.db));

  const [[sw], [fw]] = [result[1], result[2]];
  res.send(success({ sw: sw?.VN ?? null, fw: fw?.VN ?? null }));
};

// 현재 버전 정보 저장 (장비 -> 서버)
export const postVersion = async (req: Request, res: Response) => {
  const DEVICE_SN = req?.query?.DEVICE_SN ?? req?.body?.DEVICE_SN;
  const DEVICE_SW_VN = req?.query?.DEVICE_SW_VN ?? req?.body?.DEVICE_SW_VN;
  const DEVICE_FW_VN = req?.query?.DEVICE_FW_VN ?? req?.body?.DEVICE_FW_VN;
  const valid = DEVICE_SN && DEVICE_SW_VN && DEVICE_FW_VN;
  if (!valid) return res.send(fail(errorMessage.parameter));

  const { error: error1, result: result1 } = await useDatabase(
    `
    SELECT 
    VL_SQ, DEVICE_SQ, DEVICE_SW_VN, DEVICE_FW_VN
    FROM tb_version_log WHERE DEVICE_SQ = (
      SELECT DEVICE_SQ FROM tb_device
      WHERE DEVICE_SN = ? LIMIT 1
    )
    ORDER BY VL_SQ DESC LIMIT 1;
  `,
    [DEVICE_SN]
  );
  if (error1) return res.send(fail(errorMessage.db));

  const nowData = result1[0];
  if (
    DEVICE_SW_VN === nowData?.DEVICE_SW_VN &&
    DEVICE_FW_VN === nowData?.DEVICE_FW_VN
  ) {
    return res.send(success(null));
  }

  const { error: error2, result: result2 } = await useDatabase(
    `
    INSERT INTO tb_version_log (
      DEVICE_SQ, DEVICE_SW_VN, DEVICE_FW_VN
    ) VALUES (
      ?, ?, ?
    );
  `,
    [nowData?.DEVICE_SQ, DEVICE_SW_VN, DEVICE_FW_VN]
  );

  if (error2) return res.send(fail(errorMessage.db));

  res.send(success(null));
};

// 해당 버전 파일 다운로드
export const postVersionDownload = async (req: Request, res: Response) => {
  const DEVICE_SN = req?.query?.DEVICE_SN ?? req?.body?.DEVICE_SN;
  const TP = req?.query?.TP ?? req?.body?.TP;
  const VN = req?.query?.VN ?? req?.body?.VN;
  const valid = DEVICE_SN && TP && VN;
  const POST_TP = TP === "sw" ? 4 : TP === "fw" ? 5 : 0;
  if (!valid || !POST_TP) return res.send(fail(errorMessage.parameter));

  const { error, result } = await useDatabase(
    `
    SELECT * FROM tb_file
    WHERE POST_SQ IN (
      SELECT POST_SQ FROM tb_post
      WHERE POST_TP = ?
      AND MDL_SQ = (
        SELECT MDL_SQ FROM tb_device WHERE DEVICE_SN = ?
      )
      AND BUILD_VN = ?
    )
    ORDER BY FILE_SQ DESC LIMIT 1;
  `,
    [POST_TP, DEVICE_SN as string, VN as string]
  );

  if (error) return res.send(fail(errorMessage.db));
  const fileInfo = result[0];
  if (!fileInfo) return res.send(null);

  // File 찾기
  const { FILE_PATH, FILE_HASH_NM, FILE_EXT } = fileInfo;
  const uploadDir = `${__dirname}/../upload`;
  const filePath = `${uploadDir}${FILE_PATH}`;
  const fileName = `${FILE_HASH_NM}.${FILE_EXT}`;

  try {
    const FILE_DATA = await fs.readFileSync(`${filePath}/${fileName}`);
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.send(FILE_DATA); // File 리턴
  } catch {
    res.send(null);
  }
};

// 장비 On 정보 저장
export const postOn = async (req: Request, res: Response) => {
  const DEVICE_SN = req?.query?.DEVICE_SN ?? req?.body?.DEVICE_SN;
  const DT = req?.query?.DT ?? req?.body?.DT;
  const valid = DEVICE_SN && DT;
  if (!valid || DT?.length !== 19) {
    return res.send(fail(errorMessage.parameter));
  }

  const { error } = await useDatabase(
    `
    INSERT INTO tb_alive_device
    (DEVICE_SQ, AL_ON)
    SELECT DEVICE_SQ, ? FROM tb_device WHERE DEVICE_SN = ? LIMIT 1;
  `,
    [DT, DEVICE_SN]
  );

  if (error) return res.send(fail(errorMessage.db));
  res.send(success(null));
};

// 장비 Off 정보 저장
export const postOff = async (req: Request, res: Response) => {
  const DEVICE_SN = req?.query?.DEVICE_SN ?? req?.body?.DEVICE_SN;
  const DT = req?.query?.DT ?? req?.body?.DT;
  const valid = DEVICE_SN && DT;
  if (!valid || DT?.length !== 19) {
    return res.send(fail(errorMessage.parameter));
  }

  const { error } = await useDatabase(
    `
    SET @AL_SQ = (
      SELECT AL_SQ FROM tb_alive_device
      WHERE DEVICE_SQ = (
        SELECT DEVICE_SQ FROM tb_device WHERE DEVICE_SN = ? LIMIT 1
      )
      ORDER BY AL_SQ DESC LIMIT 1
    );

    UPDATE tb_alive_device SET AL_OFF = ? WHERE AL_SQ = @AL_SQ;
  `,
    [DEVICE_SN, DT]
  );

  if (error) return res.send(fail(errorMessage.db));
  res.send(success(null));
};

// 장비 Alive 정보 저장
export const postAlive = async (req: Request, res: Response) => {
  const DEVICE_SN = req?.query?.DEVICE_SN ?? req?.body?.DEVICE_SN;
  const DT = req?.query?.DT ?? req?.body?.DT;
  const valid = DEVICE_SN && DT;
  if (!valid || DT?.length !== 19) {
    return res.send(fail(errorMessage.parameter));
  }

  const { error } = await useDatabase(
    `
    SET @AL_SQ = (
      SELECT AL_SQ FROM tb_alive_device
      WHERE DEVICE_SQ = (
        SELECT DEVICE_SQ FROM tb_device WHERE DEVICE_SN = ? LIMIT 1
      )
      ORDER BY AL_SQ DESC LIMIT 1
    );

    UPDATE tb_alive_device SET AL_ALIVE = ?, AL_OFF = ? WHERE AL_SQ = @AL_SQ;
  `,
    [DEVICE_SN, DT, DT]
  );

  if (error) return res.send(fail(errorMessage.db));
  res.send(success(null));
};

// 사용 시작 일시 저장
export const postStart = async (req: Request, res: Response) => {
  const DEVICE_SN = req?.query?.DEVICE_SN ?? req?.body?.DEVICE_SN;
  const UD_MODE = req?.query?.UD_MODE ?? req?.body?.UD_MODE;
  const UD_TIME = req?.query?.UD_TIME ?? req?.body?.UD_TIME;
  const UD_START = req?.query?.UD_START ?? req?.body?.UD_START;
  const valid1 = DEVICE_SN && UD_TIME;
  const valid2 = 0 < UD_MODE && UD_MODE <= 10 && UD_START?.length === 19;
  if (!valid1 || !valid2) {
    return res.send(fail(errorMessage.parameter));
  }

  const { error, result } = await useDatabase(
    `
    INSERT INTO tb_use_device
    (DEVICE_SQ, UD_MODE, UD_TIME, UD_START)
    SELECT DEVICE_SQ, ?, ?, ?
    FROM tb_device WHERE DEVICE_SN = ?;
  `,
    [UD_MODE, UD_TIME, UD_START, DEVICE_SN]
  );

  if (error) return res.send(fail(errorMessage.db));
  res.send(success(null));
};

// 사용 종료 일시 저장
export const postEnd = async (req: Request, res: Response) => {
  const DEVICE_SN = req?.query?.DEVICE_SN ?? req?.body?.DEVICE_SN;
  const UD_END = req?.query?.UD_END ?? req?.body?.UD_END;
  const valid = DEVICE_SN && UD_END && UD_END?.length === 19;
  if (!valid) {
    return res.send(fail(errorMessage.parameter));
  }

  const { error } = await useDatabase(
    `
    SET @UD_SQ = (
      SELECT UD_SQ FROM tb_use_device
      WHERE DEVICE_SQ = (
        SELECT DEVICE_SQ FROM tb_device WHERE DEVICE_SN = ? LIMIT 1
      )
      ORDER BY UD_SQ DESC LIMIT 1
    );

    UPDATE tb_use_device SET UD_END = ? WHERE UD_SQ = @UD_SQ;
  `,
    [DEVICE_SN, UD_END]
  );

  if (error) return res.send(fail(errorMessage.db));
  res.send(success(null));
};

// 데이터 저장
export const postUse = async (req: Request, res: Response) => {
  const DEVICE_SN = req?.query?.DEVICE_SN ?? req?.body?.DEVICE_SN;
  const UDD_TP = req?.query?.UDD_TP ?? req?.body?.UDD_TP;
  const UDD_VAL = Number(req?.body?.UDD_VAL) ?? 0;
  const valid = DEVICE_SN && 0 < UDD_TP && Number(UDD_TP) <= 5;
  if (!valid || isNaN(UDD_VAL)) {
    return res.send(fail(errorMessage.parameter));
  }

  const { error } = await useDatabase(
    `
    INSERT INTO tb_use_device_data
    (DEVICE_SQ, UDD_TP, UDD_VAL)
    SELECT DEVICE_SQ, ?, ?
    FROM tb_device WHERE DEVICE_SN = ? LIMIT 1
  `,
    [UDD_TP, UDD_VAL, DEVICE_SN]
  );

  if (error) return res.send(fail(errorMessage.db));
  res.send(success(null));
};
