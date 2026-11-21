import eventDAO from "../dao/event.dao.js";

class EventRepository {
  async paginate(filter, options) {
    return await eventDAO.paginate(filter, options);
  }

  async findById(id) {
    return await eventDAO.findById(id);
  }

  async create(data) {
    return await eventDAO.create(data);
  }

  async updateById(id, data) {
    return await eventDAO.updateById(id, data);
  }
}

export default new EventRepository();
