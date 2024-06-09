import express from "express";
const router = express.Router();

import { verifyToken } from "../../middlewares/Common.js";
import {
  createTodo,
  updateTodo,
  listTodo,
} from "../controller/TodoController.js";

router.post("/todo", verifyToken, createTodo);
router.put("/todo/:id", verifyToken, updateTodo);
router.get("/todo/:id", verifyToken, listTodo);
router.get("/todo", verifyToken, listTodo);

export default router;
