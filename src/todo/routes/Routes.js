import express from "express";
const router = express.Router();

import { verifyToken } from "../../middlewares/Common.js";
import { createTodo, updateTodo } from "../controller/TodoController.js";

router.post("/todo", verifyToken, createTodo);
router.put("/todo/:id", verifyToken, updateTodo);

export default router;
