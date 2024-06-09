import express from "express";
const router = express.Router();

import {
  register,
  login,
  validationOfMagicLink,
  updateUser,
} from "../controller/UserController.js";

import { verifyToken } from "../../middlewares/Common.js";

router.post("/register", register);
router.post("/login", login);
router.get("/validate", validationOfMagicLink);
router.put("/users/:userId", verifyToken, updateUser);

export default router;
