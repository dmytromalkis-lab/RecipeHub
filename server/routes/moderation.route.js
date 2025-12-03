import { Router } from "express";
import { getModerationRecipe,
    fulfill,
    reject,
    getRegisteredUsersCount,
    getRegisteredUsersReport,
    getRecipeStatusCounts,
    getRecipesReport,
    getRecipesStats
} from "../controllers/moderation.controller.js";
import verifyToken from "../middlewares/auth.middleware.js"
import onlyAdmin from "../middlewares/onlyAdmin.middleware.js"

const router = Router();

router.post("/recipes/:id/fulfill", verifyToken, onlyAdmin, fulfill);
router.post("/recipes/:id/reject", verifyToken, onlyAdmin, reject);
router.get("/recipes", verifyToken, onlyAdmin, getModerationRecipe);

router.get("/users/count", verifyToken, onlyAdmin, getRegisteredUsersCount);
router.get("/users/report/:year", verifyToken, onlyAdmin, getRegisteredUsersReport);
router.get("/recipes/count", verifyToken, onlyAdmin, getRecipeStatusCounts);
router.get("/recipes/stats/:year",  getRecipesStats);
router.get("/recipes/report/:year", verifyToken, onlyAdmin, getRecipesReport);

export default router;
