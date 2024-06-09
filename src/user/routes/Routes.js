import express from "express";
const router = express.Router();

import {
  registerSchemaValidation,
  loginSchemaValidation,
  updateSchemaValidation,
} from "../../validation/User.js";
import {
  register,
  login,
  validationOfMagicLink,
  updateUser,
} from "../controller/UserController.js";

import { verifyToken } from "../../middlewares/Common.js";

router.post("/register", registerSchemaValidation, register);
router.post("/login", loginSchemaValidation, login);
router.get("/validate", validationOfMagicLink);
router.put("/users/:userId", updateSchemaValidation, verifyToken, updateUser);

export default router;
