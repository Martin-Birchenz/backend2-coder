import ticketRepository from "../repositories/ticket.repository.js";
import eventRepository from "../repositories/event.repository.js";
import mailService from "./mail.service.js";
import { TicketDTO } from "../dto/ticket.dto.js";
import { generateReservationCode } from "../utils/codeGenerator.utils.js";
import { CustomError } from "../utils/customError.js";

class TicketService {
  async bookTicket(eventId, quantity = 1, user) {
    if (quantity < 1) throw new CustomError("La cantidad mínima es 1", 400);

    const event = await eventRepository.findById(eventId);
    if (!event) throw new CustomError("Evento no encontrado", 404);

    if (event.status !== "published") {
      throw new CustomError("Solo podés inscribirte a eventos publicados", 400);
    }

    // Validar sin duplicado activo
    const activeTicket = await ticketRepository.findActiveByUserAndEvent(
      user.id,
      eventId,
    );
    if (activeTicket) {
      throw new CustomError(
        "Ya tenés una inscripción activa a este evento",
        409,
      );
    }

    // Validar cupo suficiente (tickets cancelled no cuentan)
    const occupiedSeats = await ticketRepository.countOccupiedSeats(eventId);
    if (occupiedSeats + Number(quantity) > event.capacity) {
      throw new CustomError(
        "No hay cupo suficiente disponible para este evento",
        409,
      );
    }

    const reservationCode = generateReservationCode();
    const ticket = await ticketRepository.create({
      user: user.id,
      event: eventId,
      quantity: Number(quantity),
      status: "active",
      reservationCode,
    });

    // Envío de notificación por email
    await mailService.sendTicketConfirmation({
      to: user.email,
      userName: user.first_name,
      eventTitle: event.title,
      eventDate: event.date,
      eventLocation: event.location,
      quantity,
      reservationCode,
    });

    return new TicketDTO(ticket);
  }

  async getMyTickets(userId) {
    const tickets = await ticketRepository.findByUser(userId);
    return tickets.map((t) => new TicketDTO(t));
  }

  async getEventTickets(eventId, user) {
    const event = await eventRepository.findById(eventId);
    if (!event) throw new CustomError("Evento no encontrado", 404);

    const isOwner = event.organizer._id.toString() === user.id;
    if (!isOwner && user.role !== "admin") {
      throw new CustomError(
        "Solo el organizador dueño o un admin pueden ver los inscriptos",
        403,
      );
    }

    const tickets = await ticketRepository.findByEvent(eventId);
    return tickets.map((t) => new TicketDTO(t));
  }

  async cancelTicket(ticketId, user) {
    const ticket = await ticketRepository.findById(ticketId);
    if (!ticket) throw new CustomError("Ticket no encontrado", 404);

    const isOwner = ticket.user.toString() === user.id;
    if (!isOwner && user.role !== "admin") {
      throw new CustomError(
        "Solo el titular del ticket o un admin pueden cancelarlo",
        403,
      );
    }

    if (ticket.status === "cancelled") {
      throw new CustomError("Este ticket ya se encuentra cancelado", 400);
    }

    const updated = await ticketRepository.updateById(ticketId, {
      status: "cancelled",
      cancelledAt: new Date(),
    });

    return new TicketDTO(updated);
  }
}

export default new TicketService();
