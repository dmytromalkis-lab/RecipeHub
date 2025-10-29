import { Router } from "express";
import { getFavorites, addFavorite, deleteFavorite } from "../controllers/favorites.controller.js";
import verifyToken from "../middlewares/auth.middleware.js"

const router = Router();

router.get("/", verifyToken, getFavorites);

router.post("/:recipeId/add", verifyToken, addFavorite);
router.delete("/:recipeId/delete", verifyToken, deleteFavorite);

export default router;
