import { Router } from "express";
import { login, register, googleAuth } from "../controllers/auth.controller.js";
import passport from "../configs/passport.js";
const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  googleAuth
);

export default router;
