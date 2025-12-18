import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import {
  deleteItemFromList,
  markItemPurchased,
} from "../controllers/shoppingItem.controller.js";

const router = Router();

router.delete("/:id", verifyToken, deleteItemFromList);
router.patch("/:id", verifyToken, markItemPurchased);

export default router;
