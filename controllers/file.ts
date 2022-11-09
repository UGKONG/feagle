import { Request, Response } from "express";
import { success } from "../functions/utils";

// 파일 다운로드
export const postFileDownload = (req: Request, res: Response) => {
  res.send(success("파일 다운로드"));
};
