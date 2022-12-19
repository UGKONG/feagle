import { Response } from "express";
import { fail, success, useDatabase, useIsNumber } from "../functions/utils";
import fs from "fs";
import { uploadDir } from "../string";

// 파일 다운로드
export const postFileDownload = async (req: any, res: Response) => {
  const FILE_SQ = req?.params?.FILE_SQ;
  const user = req?.session?.user;
  const ACT_TP = user?.ACT_TP ?? null;
  const ACT_SQ = user?.MST_SQ ?? user?.MNG_SQ ?? user?.MEM_SQ ?? null;
  const ACT_NM = user?.MST_NM ?? user?.MNG_NM ?? user?.MEM_NM ?? null;

  if (!useIsNumber(FILE_SQ) || !user) return res.send(fail());

  const { error, result } = await useDatabase(
    `
    SELECT * FROM tb_file WHERE FILE_SQ = ?;
  `,
    [FILE_SQ]
  );

  if (error) return res.send(fail());

  const fileInfo = result[0];
  if (!fileInfo) return res.send(fail());

  // File 찾기
  const { FILE_PATH, FILE_HASH_NM, FILE_EXT } = fileInfo;
  const filePath = `${uploadDir}${FILE_PATH}`;
  const fileName = `${FILE_HASH_NM}.${FILE_EXT}`;

  try {
    const FILE_DATA = await fs.readFileSync(`${filePath}/${fileName}`);
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.send(FILE_DATA); // File 리턴

    // LOG
    return useDatabase(
      `
      INSERT INTO tb_get_log (
        FILE_SQ, ACT_TP, ACT_SQ, ACT_NM
      ) VALUES (
        ?, ?, ?, ?
      )
    `,
      [FILE_SQ, ACT_TP, ACT_SQ, ACT_NM]
    );
  } catch {
    return res.send(fail());
  }
};
