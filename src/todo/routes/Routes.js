import express from "express";
const router = express.Router();

import { verifyToken } from "../../middlewares/Common.js";
import {
  createTodo,
  updateTodo,
  listTodo,
  deleteTodo,
} from "../controller/TodoController.js";

router.post("/todo", verifyToken, createTodo);
router.put("/todo/:id", verifyToken, updateTodo);
router.get("/todo/:id", verifyToken, listTodo);
router.get("/todo", verifyToken, listTodo);
router.delete("/todo/:id", verifyToken, deleteTodo);

export default router;
