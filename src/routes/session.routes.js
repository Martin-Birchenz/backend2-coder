import { Router } from "express";
import passport from "passport";
import sessionController from "../controllers/session.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { CustomError } from "../utils/customError.js";

const router = Router();

router.post("/register", (req, res, next) => {
  passport.authenticate("register", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return next(
        new CustomError(
          info?.message || "Error en registro",
          info?.statusCode || 400,
        ),
      );
    req.user = user;
    sessionController.register(req, res, next);
  })(req, res, next);
});

router.post("/login", (req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return next(
        new CustomError(
          info?.message || "Credenciales inválidas",
          info?.statusCode || 401,
        ),
      );
    req.user = user;
    sessionController.login(req, res, next);
  })(req, res, next);
});

router.get("/current", requireAuth, sessionController.current);
router.post("/logout", requireAuth, sessionController.logout);

export default router;
