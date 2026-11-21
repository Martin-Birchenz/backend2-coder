export class TicketDTO {
  constructor(ticket) {
    this.id = ticket._id?.toString() || ticket.id;
    this.event = ticket.event?._id
      ? {
          id: ticket.event._id.toString(),
          title: ticket.event.title,
          date: ticket.event.date,
          location: ticket.event.location,
        }
      : ticket.event?.toString();
    this.user = ticket.user?._id
      ? {
          id: ticket.user._id.toString(),
          first_name: ticket.user.first_name,
          last_name: ticket.user.last_name,
          email: ticket.user.email,
        }
      : ticket.user?.toString();
    this.quantity = ticket.quantity;
    this.status = ticket.status;
    this.reservationCode = ticket.reservationCode;
    this.createdAt = ticket.createdAt;
    if (ticket.cancelledAt) this.cancelledAt = ticket.cancelledAt;
  }
}
