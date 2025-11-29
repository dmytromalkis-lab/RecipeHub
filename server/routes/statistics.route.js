import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import onlyAdmin from "../middlewares/onlyAdmin.middleware.js";
import { getAllUsersCount } from "../controllers/statistics.controller.js";

const router = Router();

router.use("/users/count", getAllUsersCount);

export default router;
