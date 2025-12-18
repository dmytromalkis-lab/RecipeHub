import { Router } from "express";
import { addIngredientsToList } from "../controllers/shopingList.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyToken, addIngredientsToList);

export default router;
