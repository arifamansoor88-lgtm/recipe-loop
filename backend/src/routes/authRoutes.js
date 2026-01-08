import express from "express";
import {
  register,
  login,
  logout,
  authenticate,
  me
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticate, me);

export default router;
