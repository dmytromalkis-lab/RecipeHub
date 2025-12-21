import { Router } from "express";
import {
  createMenuPlan,
  addRecipeToMenuPlan,
  removeRecipeFromMenuPlan,
  deleteMenuPlan,
  getUserMenuPlans,
  getMenuPlanDetails,
} from "../controllers/menuPlan.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verifyToken, getUserMenuPlans);
router.get("/:menu_plan_id", verifyToken, getMenuPlanDetails);
router.post("/create", verifyToken, createMenuPlan);
router.post("/add-recipe", verifyToken, addRecipeToMenuPlan);
router.put("/remove-recipe", verifyToken, removeRecipeFromMenuPlan);
router.delete("/:menu_plan_id", verifyToken, deleteMenuPlan);

export default router;
