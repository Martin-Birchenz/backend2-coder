import mongoose from "mongoose";
import { envConfig } from "./env.config.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(envConfig.mongoUrl);
    console.log("Conectado a MongoDB correctamente");
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error.message);
    process.exit(1);
  }
};
