import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import {
  createRecipe,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getMyRecipes,
  getLatest,
  searchRecipes,
} from "../controllers/recipe.controller.js";

const router = Router();

router.get("/my", verifyToken, getMyRecipes);

router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "stepImages", maxCount: 30 },
  ]),
  createRecipe
);
router.get("/latest", getLatest);
router.get("/search", searchRecipes);
router.get("/:id", getRecipeById);
router.put(
  "/:id",
  verifyToken,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "stepImages", maxCount: 30 },
  ]),
  updateRecipe
);
router.delete("/:id", verifyToken, deleteRecipe);

export default router;
