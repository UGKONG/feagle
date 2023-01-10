import fs from "fs";
import { Response } from "express";
import { fail, success, useDatabase, useIsNumber } from "../functions/utils";
import { errorMessage } from "../string";

const uploadPath = __dirname + "/../upload/";
const downloadPath = __dirname + "/../upload";

type FileData = {
  POST_SQ: number;
  FILE_HASH_NM: string;
  FILE_NM: string;
  FILE_SZ: number;
  FILE_EXT: string;
};

// 파일 다운로드
export const getFileDownload = async (req: any, res: Response) => {
  const FILE_SQ = req?.params?.FILE_SQ;
  const user = req?.session?.user;
  const ACT_TP = req?.query?.TP ?? req?.body?.TP ?? user?.ACT_TP ?? null;
  const ACT_SQ =
    req?.query?.SQ ??
    req?.body?.SQ ??
    user?.MST_SQ ??
    user?.MNG_SQ ??
    user?.MEM_SQ ??
    null;
  const ACT_NM =
    req?.query?.NM ??
    req?.body?.NM ??
    user?.MST_NM ??
    user?.MNG_NM ??
    user?.MEM_NM ??
    null;

  if (!useIsNumber(FILE_SQ) || !ACT_TP || !ACT_SQ || !ACT_NM) {
    return res.send(
      fail("FILE_SQ가 number 타입이 아니거나 다운받는 유저 정보가 없습니다.")
    );
  }

  const { error, result } = await useDatabase(
    `
    SELECT * FROM tb_file WHERE FILE_SQ = ?;
  `,
    [FILE_SQ]
  );

  if (error) return res.send(fail(errorMessage.db));

  const fileInfo = result[0];
  if (!fileInfo) return res.send(fail("파일정보가 없습니다."));

  // File 찾기
  const { FILE_HASH_NM } = fileInfo;
  const filePath = `${downloadPath}/`;

  try {
    const FILE_DATA = await fs.readFileSync(`${filePath}${FILE_HASH_NM}`);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${FILE_HASH_NM}`
    );
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
  } catch (err) {
    console.log(err);
    return res.send(fail("파일을 가져오는데 실패하였습니다."));
  }
};

// 파일 업로드
export const postFileUpload = async (req: any, res: Response) => {
  const POST_SQ = req?.params?.POST_SQ;
  const files = req?.files?.files;
  const fileCount: number = req?.body?.fileCount ?? 0;

  if (fileCount > 1 && (!files || !files?.length)) return res.send(fail());

  let fileData: FileData[] = [];
  let sql: string[] = [];

  try {
    if (fileCount == 1) {
      let file = files;
      let path = file?.path;
      let FILE_NM = file?.originalFilename;
      let FILE_SZ = file?.size;
      let split = path?.split("/");
      let FILE_HASH_NM = split[split?.length - 1];
      split = FILE_HASH_NM?.split(".");
      let FILE_EXT = split[split?.length - 1];

      // 파일 저장
      fs.copyFileSync(path, uploadPath + FILE_HASH_NM);
      fs.unlinkSync(path);

      fileData.push({ POST_SQ, FILE_HASH_NM, FILE_NM, FILE_SZ, FILE_EXT });
      sql.push(`(
      '${POST_SQ}', '${FILE_HASH_NM}', 
      '${FILE_NM}', '${FILE_SZ}', '${FILE_EXT}'
    )`);
    } else {
      files?.forEach((file: any) => {
        let path = file?.path;
        let FILE_NM = file?.originalFilename;
        let FILE_SZ = file?.size;
        let split = path?.split("/");
        let FILE_HASH_NM = split[split?.length - 1];
        split = FILE_HASH_NM?.split(".");
        let FILE_EXT = split[split?.length - 1];

        // 파일 저장
        fs.copyFileSync(path, uploadPath + FILE_HASH_NM);
        fs.unlinkSync(path);

        fileData.push({ POST_SQ, FILE_HASH_NM, FILE_NM, FILE_SZ, FILE_EXT });
        sql.push(`(
        '${POST_SQ}', '${FILE_HASH_NM}', 
        '${FILE_NM}', '${FILE_SZ}', '${FILE_EXT}'
      )`);
      });
    }
  } catch (err) {
    console.log(err);
    res.send(fail("파일 업로드에 실패하였습니다."));
  }

  const { error } = await useDatabase(
    `
    INSERT INTO tb_file (
      POST_SQ, FILE_HASH_NM, FILE_NM, FILE_SZ, FILE_EXT
    ) VALUES ${sql?.join(", ")};
  `,
    []
  );

  if (error) return res.send(fail("파일 저장에 실패하였습니다."));

  res.send(success());
};
