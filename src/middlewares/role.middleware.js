import { CustomError } from "../utils/customError.js";

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new CustomError("No autenticado", 401));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new CustomError("Acceso denegado: permisos insuficientes", 403),
      );
    }
    next();
  };
};
