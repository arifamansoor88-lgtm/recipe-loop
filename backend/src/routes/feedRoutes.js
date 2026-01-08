import express from "express";
import { authenticate } from "../controllers/authController.js";
import { getFeed } from "../controllers/feedController.js";

const router = express.Router();

router.get("/", authenticate, getFeed);

export default router;
