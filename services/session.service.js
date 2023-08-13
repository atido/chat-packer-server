const SessionModel = require('../models/Session.model');
const MongooseService = require('./mongoose.service');

class SessionService {
  constructor() {
    this.mongooseService = new MongooseService(SessionModel);
  }

  async getSessionByIdOrCreate(sessionId) {
    try {
      const session = await this.mongooseService.findById(sessionId);
      if (session) return session;
      else return await this.mongooseService.create({});
    } catch (err) {
      throw err;
    }
  }

  async getSessionById(sessionId) {
    try {
      return await this.mongooseService.findById(sessionId);
    } catch (err) {
      throw err;
    }
  }

  async createSession() {
    return await this.mongooseService.create();
  }

  async updateSessionContent(sessionId, content) {
    try {
      return await this.mongooseService.updateById(sessionId, { content });
    } catch (err) {
      throw err;
    }
  }
}
module.exports = SessionService;
