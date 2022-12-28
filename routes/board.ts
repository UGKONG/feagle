import { Router } from "express";
import {
  deleteBoard,
  getBoardDetail,
  getBoardList,
  postBoard,
  putBoard,
} from "../controllers/board";

const boardRouter = Router();

boardRouter
  .get("/", getBoardList)
  .get("/:POST_SQ", getBoardDetail)
  .post("/", postBoard)
  .put("/:POST_SQ", putBoard)
  .delete("/:POST_SQ", deleteBoard);

export default boardRouter;
