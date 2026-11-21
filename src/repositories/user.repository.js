import userDAO from "../dao/user.dao.js";

class UserRepository {
  async findByEmail(email) {
    return await userDAO.findByEmail(email);
  }

  async findById(id) {
    return await userDAO.findById(id);
  }

  async create(userData) {
    return await userDAO.create(userData);
  }
}

export default new UserRepository();
