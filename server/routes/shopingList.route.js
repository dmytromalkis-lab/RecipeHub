import { Router } from "express";
import {
  addIngredientsToList,
  getList,
} from "../controllers/shopingList.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyToken, addIngredientsToList);
router.get("/", verifyToken, getList);

export default router;
