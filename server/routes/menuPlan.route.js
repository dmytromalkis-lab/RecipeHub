import { Router } from "express";
import { createMenuPlan } from "../controllers/menuPlan.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create", verifyToken, createMenuPlan);

export default router;
