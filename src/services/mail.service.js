import nodemailer from "nodemailer";
import { envConfig } from "../config/env.config.js";

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: envConfig.mail.host,
      port: envConfig.mail.port,
      auth: {
        user: envConfig.mail.user,
        pass: envConfig.mail.pass,
      },
    });
  }

  async sendTicketConfirmation({
    to,
    userName,
    eventTitle,
    eventDate,
    eventLocation,
    quantity,
    reservationCode,
  }) {
    try {
      await this.transporter.sendMail({
        from: envConfig.mail.from,
        to,
        subject: `Confirmación de inscripción: ${eventTitle} (${reservationCode})`,
        html: `
          <h2>¡Hola ${userName}! Tu inscripción está confirmada</h2>
          <p><strong>Evento:</strong> ${eventTitle}</p>
          <p><strong>Fecha:</strong> ${new Date(eventDate).toLocaleString("es-AR")}</p>
          <p><strong>Ubicación:</strong> ${eventLocation}</p>
          <p><strong>Entradas:</strong> ${quantity}</p>
          <p><strong>Código de reserva:</strong> <code>${reservationCode}</code></p>
        `,
      });
    } catch (error) {
      // Log controlado sin interrumpir la creación del ticket si falla el servidor SMTP externo
      console.error("Error enviando correo de confirmación:", error.message);
    }
  }
}

export default new MailService();
