import eventService from "../services/event.service.js";

class EventController {
  async getAll(req, res, next) {
    try {
      const result = await eventService.listEvents(req.query);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const event = await eventService.getEventById(req.params.id);
      return res.status(200).json({ status: "success", payload: event });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const created = await eventService.createEvent(req.body, req.user.id);
      return res.status(201).json({ status: "success", payload: created });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const updated = await eventService.updateEvent(
        req.params.id,
        req.body,
        req.user,
      );
      return res.status(200).json({ status: "success", payload: updated });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const updated = await eventService.updateStatus(
        req.params.id,
        req.body.status,
        req.user,
      );
      return res.status(200).json({ status: "success", payload: updated });
    } catch (error) {
      next(error);
    }
  }
}

export default new EventController();
