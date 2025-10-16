import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import { updateAvatar, updateUser } from "../controllers/user.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = Router();

router.put("/:id", verifyToken, updateUser);
router.put("/:id/avatar", verifyToken, upload.single("avatar"), updateAvatar);

export default router;
