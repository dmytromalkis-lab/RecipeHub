import { Router } from "express";
import {
  createMenuPlan,
  addRecipeToMenuPlan,
  removeRecipeFromMenuPlan,
  deleteMenuPlan,
} from "../controllers/menuPlan.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create", verifyToken, createMenuPlan);
router.post("/add-recipe", verifyToken, addRecipeToMenuPlan);
router.put("/remove-recipe", verifyToken, removeRecipeFromMenuPlan);
router.delete("/:menu_plan_id", verifyToken, deleteMenuPlan);

export default router;
