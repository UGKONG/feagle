import type { Request, Response } from "express";
import { success } from "../functions/utils";

export const test = (req: Request, res: Response): void => {
  res.send(success({ request: true, response: true }));
};
