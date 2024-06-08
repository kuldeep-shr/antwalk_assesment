import express from "express";
const router = express.Router();

import { register } from "../controller/UserController.js";

router.post("/signin", register);

export default router;
