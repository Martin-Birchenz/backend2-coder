import mongoose from "mongoose";
import { TicketModel } from "../models/ticket.model.js";

class TicketDAO {
  async create(data) {
    const created = await TicketModel.create(data);
    return created.toObject();
  }
  async findById(id) {
    return await TicketModel.findById(id)
      .populate("event", "title date location organizer")
      .lean();
  }
  async findActiveByUserAndEvent(userId, eventId) {
    return await TicketModel.findOne({
      user: userId,
      event: eventId,
      status: "active",
    }).lean();
  }
  async findByUser(userId) {
    return await TicketModel.find({ user: userId })
      .populate("event", "title date location price status")
      .sort({ createdAt: -1 })
      .lean();
  }
  async findByEvent(eventId) {
    return await TicketModel.find({ event: eventId })
      .populate("user", "first_name last_name email")
      .sort({ createdAt: -1 })
      .lean();
  }
  async countOccupiedSeats(eventId) {
    const result = await TicketModel.aggregate([
      {
        $match: {
          event: new mongoose.Types.ObjectId(eventId),
          status: "active",
        },
      },
      { $group: { _id: null, totalQuantity: { $sum: "$quantity" } } },
    ]);
    return result.length > 0 ? result[0].totalQuantity : 0;
  }
  async updateById(id, data) {
    return await TicketModel.findByIdAndUpdate(id, data, { new: true }).lean();
  }
}

export default new TicketDAO();
