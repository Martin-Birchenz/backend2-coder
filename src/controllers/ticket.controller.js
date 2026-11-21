import ticketService from "../services/ticket.service.js";

class TicketController {
  async book(req, res, next) {
    try {
      const quantity = req.body.quantity || 1;
      const ticket = await ticketService.bookTicket(
        req.params.eid,
        quantity,
        req.user,
      );
      return res.status(201).json({ status: "success", payload: ticket });
    } catch (error) {
      next(error);
    }
  }

  async getMyTickets(req, res, next) {
    try {
      const tickets = await ticketService.getMyTickets(req.user.id);
      return res.status(200).json({ status: "success", payload: tickets });
    } catch (error) {
      next(error);
    }
  }

  async getByEvent(req, res, next) {
    try {
      const tickets = await ticketService.getEventTickets(
        req.params.eid,
        req.user,
      );
      return res.status(200).json({ status: "success", payload: tickets });
    } catch (error) {
      next(error);
    }
  }

  async cancel(req, res, next) {
    try {
      const ticket = await ticketService.cancelTicket(req.params.tid, req.user);
      return res.status(200).json({ status: "success", payload: ticket });
    } catch (error) {
      next(error);
    }
  }
}

export default new TicketController();
