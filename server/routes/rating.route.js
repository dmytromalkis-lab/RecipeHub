import { Router } from "express";
import { createOrUpdateRating } from "../controllers/rating.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/:recipeId", verifyToken, createOrUpdateRating);

export default router;
