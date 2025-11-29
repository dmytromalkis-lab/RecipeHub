import { Router } from "express";
import authRouter from "./auth.route.js";
import userRouter from "./user.route.js";
import favoritesRouter from "./favorites.route.js";
import moderationRouter from "./moderation.route.js";
import recipeRouter from "./recipe.route.js";
import categoryRouter from "./category.route.js";
import commentRouter from "./comment.route.js";
import raitingRouter from "./rating.route.js";
import statisticRouter from "./statistics.route.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/favorites", favoritesRouter);
router.use("/moderation", moderationRouter);
router.use("/recipes", recipeRouter);
router.use("/categories", categoryRouter);
router.use("/comment", commentRouter);
router.use("/rating", raitingRouter);
router.use("/statistics", statisticRouter);

export default router;
