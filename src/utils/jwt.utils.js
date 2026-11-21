import jwt from "jsonwebtoken";
import { envConfig } from "../config/env.config.js";

export const generateToken = (user) => {
  // Nunca incluir password en el payload del JWT
  const payload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    first_name: user.first_name,
    last_name: user.last_name,
  };
  return jwt.sign(payload, envConfig.jwtSecret, {
    expiresIn: envConfig.jwtExpiresIn,
  });
};
