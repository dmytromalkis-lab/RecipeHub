import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import { createComment } from "../controllers/comment.controller.js";

const router = Router();

router.post("/create/:recipeId", verifyToken, createComment);

export default router;
