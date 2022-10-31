import type { Request, Response } from "express";
import fs from "fs";

const view = (req: Request, res: Response) => {
  const filePath: string = __dirname + "/../view/index.html";

  const errorMessage: string = filePath || "알 수 없는 페이지입니다.";

  fs.readFile(filePath, "utf-8", (err: Error | null, html) => {
    if (err) return res.status(404).send(errorMessage);
    res.status(200).send(html);
  });
};

export default view;
