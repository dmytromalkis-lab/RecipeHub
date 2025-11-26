import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import {
  createComment,
  updateComment,
  deleteComment,
  getCommentsForRecipe,
} from "../controllers/comment.controller.js";

const router = Router();

router.post("/create/:recipeId", verifyToken, createComment);
router.put("/:id", verifyToken, updateComment);
router.delete("/:id", verifyToken, deleteComment);
router.get("/:recipeId", getCommentsForRecipe);

export default router;
