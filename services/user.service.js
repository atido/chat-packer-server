const UserModel = require("../models/User.model");
const MongooseService = require("../services/mongoose.service");

class UserService {
  constructor() {
    this.mongooseService = new MongooseService(UserModel);
  }

  async checkIfUserExist(username, email) {
    return await this.mongooseService.count({ $or: [{ username }, { email }] });
  }

  async createUser(email, password, username) {
    return await this.mongooseService.create({ email, password, username });
  }
  async getUserByEmail(email) {
    return await this.mongooseService.findOne({ email });
  }
}

module.exports = UserService;
