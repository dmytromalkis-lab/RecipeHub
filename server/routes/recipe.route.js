import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { createRecipe, getRecipeById, updateRecipe, deleteRecipe } from "../controllers/recipe.controller.js";

const router = Router();

router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "stepImages", maxCount: 30 },
  ]),
  createRecipe
);
router.get("/:id", verifyToken, getRecipeById);
router.put("/:id", verifyToken, updateRecipe);
router.delete("/:id", verifyToken, deleteRecipe);

export default router;


