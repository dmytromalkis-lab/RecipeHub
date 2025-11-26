import { Router } from "express";
import authRouter from "./auth.route.js";
import userRouter from "./user.route.js";
import favoritesRouter from "./favorites.route.js";
import moderationRouter from "./moderation.route.js";
import recipeRouter from "./recipe.route.js";
import categoryRouter from "./category.route.js";
import commentRouter from "./comment.route.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/favorites", favoritesRouter);
router.use("/moderation", moderationRouter);
router.use("/recipes", recipeRouter);
router.use("/categories", categoryRouter);
router.use("/comment", commentRouter);

export default router;
