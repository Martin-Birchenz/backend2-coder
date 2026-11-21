import eventRepository from "../repositories/event.repository.js";
import { EventDTO } from "../dto/event.dto.js";
import { CustomError } from "../utils/customError.js";

class EventService {
  async listEvents(queryParams) {
    const {
      status,
      category,
      location,
      fromDate,
      toDate,
      page = 1,
      limit = 10,
      sort = "date",
    } = queryParams;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = { $regex: category, $options: "i" };
    if (location) filter.location = { $regex: location, $options: "i" };
    if (fromDate || toDate) {
      filter.date = {};
      if (fromDate) filter.date.$gte = new Date(fromDate);
      if (toDate) filter.date.$lte = new Date(toDate);
    }

    const options = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sort: sort.startsWith("-") ? { [sort.slice(1)]: -1 } : { [sort]: 1 },
      populate: { path: "organizer", select: "first_name last_name email" },
      lean: true,
    };

    const result = await eventRepository.paginate(filter, options);

    return {
      status: "success",
      data: result.docs.map((doc) => new EventDTO(doc)),
      page: result.page,
      limit: result.limit,
      total: result.totalDocs,
      totalPages: result.totalPages,
    };
  }

  async getEventById(id) {
    const event = await eventRepository.findById(id);
    if (!event) throw new CustomError("Evento no encontrado", 404);
    return new EventDTO(event);
  }

  async createEvent(data, organizerId) {
    if (new Date(data.date) <= new Date()) {
      throw new CustomError("La fecha del evento debe ser futura", 400);
    }
    if (!data.capacity || data.capacity <= 0) {
      throw new CustomError("La capacidad debe ser mayor a 0", 400);
    }
    if (data.price !== undefined && data.price < 0) {
      throw new CustomError("El precio no puede ser negativo", 400);
    }

    const created = await eventRepository.create({
      ...data,
      organizer: organizerId,
    });
    return new EventDTO(created);
  }

  async updateEvent(id, data, user) {
    const event = await eventRepository.findById(id);
    if (!event) throw new CustomError("Evento no encontrado", 404);

    // Solo dueño o admin
    const isOwner = event.organizer._id.toString() === user.id;
    if (!isOwner && user.role !== "admin") {
      throw new CustomError(
        "No tenés permisos para modificar este evento",
        403,
      );
    }

    if (event.status === "cancelled") {
      throw new CustomError("No se puede modificar un evento cancelado", 400);
    }
    if (data.date && new Date(data.date) <= new Date()) {
      throw new CustomError("La fecha del evento debe ser futura", 400);
    }
    if (data.capacity !== undefined && data.capacity <= 0) {
      throw new CustomError("La capacidad debe ser mayor a 0", 400);
    }
    if (data.price !== undefined && data.price < 0) {
      throw new CustomError("El precio no puede ser negativo", 400);
    }

    // Evitar reasignar organizer por payload
    delete data.organizer;

    const updated = await eventRepository.updateById(id, data);
    return new EventDTO(updated);
  }

  async updateStatus(id, status, user) {
    const validStatuses = ["draft", "published", "cancelled", "finished"];
    if (!validStatuses.includes(status)) {
      throw new CustomError("Estado inválido", 400);
    }
    return await this.updateEvent(id, { status }, user);
  }
}

export default new EventService();
