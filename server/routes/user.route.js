import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import {
  getUserById,
  updateAvatar,
  updateUser,
  deleteUser,
  getAllUsers,
  blockUser,
  unblockUser,
} from "../controllers/user.controller.js";
import upload from "../middlewares/upload.middleware.js";
import onlyAdmin from "../middlewares/onlyAdmin.middleware.js";

const router = Router();

router.get("/all", verifyToken, onlyAdmin, getAllUsers);
router.get("/:id", getUserById);
router.patch("/:id/block", verifyToken, onlyAdmin, blockUser);
router.patch("/:id/unblock", verifyToken, onlyAdmin, unblockUser);
router.put("/:id", verifyToken, updateUser);
router.put("/:id/avatar", verifyToken, upload.single("avatar"), updateAvatar);
router.delete("/:id", verifyToken, onlyAdmin, deleteUser);

export default router;
