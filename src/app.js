import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import { initializePassport } from "./config/passport.config.js";
import apiRoutes from "./routes/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

initializePassport();
app.use(passport.initialize());

app.use("/api", apiRoutes);

app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Ruta no encontrada" });
});

app.use(errorHandler);

export default app;
