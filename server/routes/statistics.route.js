import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import onlyAdmin from "../middlewares/onlyAdmin.middleware.js";
import {
  getAllUsersCount,
  getCountsRecipe,
  getRecipesByMonth,
} from "../controllers/statistics.controller.js";

const router = Router();

router.get("/users/count", getAllUsersCount);
router.get("/recipe/count", getCountsRecipe);
router.get("/recipe/year/:year", getRecipesByMonth);

export default router;
