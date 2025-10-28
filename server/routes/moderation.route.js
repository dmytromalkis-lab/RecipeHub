import { Router } from "express";
import { getModerationRecipe, fulfill, reject } from "../controllers/moderation.controller.js";
import verifyToken from "../middlewares/auth.middleware.js"
import onlyAdmin from "../middlewares/onlyAdmin.middleware.js"

const router = Router();

router.post("/recipes/:id/fulfill", verifyToken, onlyAdmin, fulfill);
router.post("/recipes/:id/reject", verifyToken, onlyAdmin, reject);

router.get("/recipes", onlyAdmin, getModerationRecipe);

router.get("/test", (req, res) => {
  res.send("Router is working!");
});

export default router;
