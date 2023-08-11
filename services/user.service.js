const UserModel = require('../models/User.model');
const MongooseService = require('../services/mongoose.service');

class UserService {
  constructor() {
    this.mongooseService = new MongooseService(UserModel);
  }

  async checkIfUserExist(username, email) {
    try {
      return await this.mongooseService.count({ $or: [{ username }, { email }] });
    } catch (err) {
      throw err;
    }
  }

  async checkOtherUserWithSameUsername(id, username) {
    try {
      return await this.mongooseService.count({
        username,
        _id: { $ne: id },
      });
    } catch (err) {
      throw err;
    }
  }

  async createUser(email, password, username, avatar) {
    try {
      return await this.mongooseService.create({ email, password, username, avatar });
    } catch (err) {
      throw err;
    }
  }
  async updateUser(id, email, password, username) {
    try {
      return await this.mongooseService.updateById(id, { email, password, username });
    } catch (err) {
      throw err;
    }
  }

  async updateAvatar(id, avatar) {
    try {
      return await this.mongooseService.updateById(id, { avatar });
    } catch (err) {
      throw err;
    }
  }

  async getUserByEmail(email) {
    try {
      return await this.mongooseService.findOne({ email });
    } catch (err) {
      throw err;
    }
  }
  async getUserById(id) {
    try {
      return await this.mongooseService.findById(id);
    } catch (err) {
      throw err;
    }
  }
}

module.exports = UserService;
