import mongoose from "mongoose";
import { envConfig } from "../config/env.config.js";
import { UserModel } from "../models/user.model.js";
import { createHash } from "./hash.utils.js";

const seedUsers = async () => {
  try {
    await mongoose.connect(envConfig.mongoUrl);
    console.log("Conectado a MongoDB para ejecutar seed...");

    const testUsers = [
      {
        first_name: "Admin",
        last_name: "Plataforma",
        email: "admin@eventos.com",
        password: createHash("Admin1234!"),
        role: "admin",
      },
      {
        first_name: "Carlos",
        last_name: "Organizador",
        email: "organizer@eventos.com",
        password: createHash("Organizer1234!"),
        role: "organizer",
      },
      {
        first_name: "Laura",
        last_name: "Organizadora Dos",
        email: "organizer2@eventos.com",
        password: createHash("Organizer1234!"),
        role: "organizer",
      },
      {
        first_name: "Juan",
        last_name: "Asistente",
        email: "user@eventos.com",
        password: createHash("User1234!"),
        role: "user",
      },
    ];

    for (const u of testUsers) {
      await UserModel.findOneAndUpdate(
        { email: u.email },
        { $set: u },
        { upsert: true, new: true },
      );
    }

    console.log("Usuarios de prueba creados/actualizados correctamente:");
    console.log("- admin@eventos.com / Admin1234! (rol: admin)");
    console.log("- organizer@eventos.com / Organizer1234! (rol: organizer)");
    console.log("- organizer2@eventos.com / Organizer1234! (rol: organizer)");
    console.log("- user@eventos.com / User1234! (rol: user)");
  } catch (error) {
    console.error("Error ejecutando seed:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedUsers();
