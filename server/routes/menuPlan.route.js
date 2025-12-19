import { Router } from "express";
import {
  createMenuPlan,
  addRecipeToMenuPlan,
} from "../controllers/menuPlan.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create", verifyToken, createMenuPlan);
router.post("/add-recipe", verifyToken, addRecipeToMenuPlan);

export default router;
