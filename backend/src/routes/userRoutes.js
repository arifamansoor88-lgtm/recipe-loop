import express from "express";
import { authenticate } from "../controllers/authController.js";
import {
  getUserProfile,
  updateProfile,
  searchUsers,
  toggleFollow,
  getSuggestedUsers
} from "../controllers/userController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/search", searchUsers);
router.get("/suggested", authenticate, getSuggestedUsers);
router.get("/:username", authenticate, getUserProfile);

router.put(
  "/me",
  authenticate,
  upload.single("avatar"),
  updateProfile
);

router.post(
  "/:username/follow",
  authenticate,
  toggleFollow
);

export default router;
