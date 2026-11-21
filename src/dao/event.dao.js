import { EventModel } from "../models/event.model.js";

class EventDAO {
  async paginate(filter, options) {
    return await EventModel.paginate(filter, options);
  }
  async findById(id) {
    return await EventModel.findById(id)
      .populate("organizer", "first_name last_name email")
      .lean();
  }
  async create(data) {
    const created = await EventModel.create(data);
    return created.toObject();
  }
  async updateById(id, data) {
    return await EventModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
  }
}

export default new EventDAO();
