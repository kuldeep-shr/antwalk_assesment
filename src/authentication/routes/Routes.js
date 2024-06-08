import express from "express";
const router = express.Router();

import { verifyToken } from "../../middlewares/Common.js";
import { register, validateMagicLink } from "../controller/UserController.js";

router.post("/signin", register);
router.get("/validate", validateMagicLink);

export default router;
