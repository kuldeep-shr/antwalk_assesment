import express from "express";
const router = express.Router();

import {
  register,
  validationOfMagicLink,
} from "../controller/UserController.js";

router.post("/signin", register);
router.get("/validate", validationOfMagicLink);

export default router;
