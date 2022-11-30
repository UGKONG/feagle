import { Router } from "express";
import {
  deleteBoard,
  getBoardDetail,
  getBoardList,
  postBoard,
} from "../controllers/board";

const boardRouter = Router();

boardRouter
  .get("/", getBoardList)
  .get("/:POST_SQ", getBoardDetail)
  .post("/", postBoard)
  .delete("/:POST_SQ", deleteBoard);

export default boardRouter;
