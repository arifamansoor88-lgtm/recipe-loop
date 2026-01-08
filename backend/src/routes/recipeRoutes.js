import express from "express";
import { authenticate } from "../controllers/authController.js";
import {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  getMyRecipes,
} from "../controllers/recipeController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/", authenticate, upload.single("image"), createRecipe);
router.get("/", getAllRecipes);
router.get("/me", authenticate, getMyRecipes);
router.get("/:id", getRecipeById);

export default router;
