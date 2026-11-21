import ticketDAO from "../dao/ticket.dao.js";

class TicketRepository {
  async create(data) {
    return await ticketDAO.create(data);
  }

  async findById(id) {
    return await ticketDAO.findById(id);
  }

  async findActiveByUserAndEvent(userId, eventId) {
    return await ticketDAO.findActiveByUserAndEvent(userId, eventId);
  }

  async findByUser(userId) {
    return await ticketDAO.findByUser(userId);
  }

  async findByEvent(eventId) {
    return await ticketDAO.findByEvent(eventId);
  }

  async countOccupiedSeats(eventId) {
    return await ticketDAO.countOccupiedSeats(eventId);
  }

  async updateById(id, data) {
    return await ticketDAO.updateById(id, data);
  }
}

export default new TicketRepository();
