import { Router } from "express";
import authRouter from "./auth.route.js";
import userRouter from "./user.route.js";
import moderationRouter from "./moderation.route.js";
const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/moderation", moderationRouter);

export default router;
