import { Router } from "express";
import {
  createMenuPlan,
  addRecipeToMenuPlan,
  removeRecipeFromMenuPlan,
} from "../controllers/menuPlan.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create", verifyToken, createMenuPlan);
router.post("/add-recipe", verifyToken, addRecipeToMenuPlan);
router.put("/remove-recipe", verifyToken, removeRecipeFromMenuPlan);

export default router;
