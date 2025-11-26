import { Router } from "express";
import {
  createOrUpdateRating,
  getAverageRaiting,
} from "../controllers/rating.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/:recipeId", verifyToken, createOrUpdateRating);
router.get("/:recipeId/average", getAverageRaiting);
// router.get("/:recipeId/my", verifyToken, getMyRaitingForRecipe);

export default router;
