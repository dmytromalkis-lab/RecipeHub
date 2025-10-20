import { Router } from "express";
import { login, register, googleAuth, googleAuthMobile } from "../controllers/auth.controller.js";
import passport from "../configs/passport.js";
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google/mobile", googleAuthMobile);

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
    failureRedirect: `${process.env.FRONTEND_URL.replace(/\/+$/, '')}/login`,
    session: false,
  }),
  googleAuth
);

export default router;
