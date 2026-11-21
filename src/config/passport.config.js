import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import userRepository from "../repositories/user.repository.js";
import { createHash, isValidPassword } from "../utils/hash.utils.js";
import { envConfig } from "./env.config.js";

const cookieExtractor = (req) => {
  return req?.cookies?.jwtCookie || null;
};

export const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        try {
          const { first_name, last_name } = req.body;
          if (!first_name || !last_name || !email || !password) {
            return done(null, false, {
              message: "Todos los campos son obligatorios",
              statusCode: 400,
            });
          }

          const exists = await userRepository.findByEmail(email);
          if (exists) {
            return done(null, false, {
              message: "El email ya está registrado",
              statusCode: 409,
            });
          }

          const newUser = await userRepository.create({
            first_name,
            last_name,
            email,
            password: createHash(password),
            role: "user",
          });

          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await userRepository.findByEmail(email);
          if (!user || !isValidPassword(user, password)) {
            return done(null, false, {
              message: "Credenciales inválidas",
              statusCode: 401,
            });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  passport.use(
    "current",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: envConfig.jwtSecret,
      },
      async (jwtPayload, done) => {
        try {
          return done(null, jwtPayload);
        } catch (error) {
          return done(error, false);
        }
      },
    ),
  );
};
