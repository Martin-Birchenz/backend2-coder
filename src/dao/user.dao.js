import { UserModel } from "../models/user.model.js";

class UserDAO {
  async findByEmail(email) {
    return await UserModel.findOne({ email }).lean();
  }
  async findById(id) {
    return await UserModel.findById(id).lean();
  }
  async create(userData) {
    const created = await UserModel.create(userData);
    return created.toObject();
  }
}

export default new UserDAO();
