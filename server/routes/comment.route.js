import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import {
  createComment,
  updateComment,
} from "../controllers/comment.controller.js";

const router = Router();

router.post("/create/:recipeId", verifyToken, createComment);
router.put("/:id", verifyToken, updateComment);

export default router;
