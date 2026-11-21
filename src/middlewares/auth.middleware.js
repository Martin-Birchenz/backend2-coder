import passport from "passport";
import { CustomError } from "../utils/customError.js";

export const requireAuth = (req, res, next) => {
  passport.authenticate("current", { session: false }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      return next(new CustomError("No autenticado, token inválido", 401));
    }
    req.user = user;
    next();
  })(req, res, next);
};
