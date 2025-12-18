import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import { deleteItemFromList } from "../controllers/shoppingItem.controller.js";

const router = Router();

router.delete("/:id", verifyToken, deleteItemFromList);

export default router;
