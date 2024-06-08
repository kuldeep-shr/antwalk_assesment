import express from "express";
const router = express.Router();

import { verifyToken } from "../../middlewares/Common.js";
import { createTodo } from "../controller/TodoController.js";

router.post("/todos", verifyToken, createTodo);

export default router;
