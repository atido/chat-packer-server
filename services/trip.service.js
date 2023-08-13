const TripModel = require('../models/Trip.model');
const MongooseService = require('./mongoose.service');
const PhotoService = require('./api/photo.service');
const SessionService = require('./session.service');

class TripService {
  constructor() {
    this.mongooseServiceInstance = new MongooseService(TripModel);
    this.photoServiceInstance = new PhotoService();
    this.sessionServiceInstance = new SessionService();
  }

  async getTripsByUserId(userId) {
    try {
      return await this.mongooseServiceInstance.find({ userId }, { tripInfo: 1, destinationPhoto: 1 });
    } catch (err) {
      throw err;
    }
  }
  async getTripById(_id, userId) {
    try {
      const res = await this.mongooseServiceInstance.findOneWithPopulate({ _id, userId }, '', ['flight', 'accommodation']);
      return res;
    } catch (err) {
      throw err;
    }
  }
  async createTrip(userId, tripInfo, flightId, accommodationId) {
    try {
      const { photo } = await this.photoServiceInstance.getRandomPhoto(tripInfo.destinationCity);
      return await this.mongooseServiceInstance.create({
        userId,
        tripInfo,
        flight: flightId,
        accommodation: accommodationId,
        destinationPhoto: photo,
      });
    } catch (err) {
      throw err;
    }
  }

  async attachTripFromSession(sessionId, userId) {
    const session = await this.sessionServiceInstance.getSessionById(sessionId);
    if (session) {
      let jsonContent = session.content ? JSON.parse(session.content) : null;

      //if tripCreatedId is in session
      if (jsonContent?.tripCreatedId) {
        await this.attachTripToUser(jsonContent.tripCreatedId, userId);
        // reinit the trip and the state in session
        delete jsonContent.tripCreatedId;
        delete jsonContent.currentState;
        await this.sessionServiceInstance.updateSessionContent(session._id, JSON.stringify(jsonContent));
      }
    }
  }

  async attachTripToUser(tripId, userId) {
    try {
      return await this.mongooseServiceInstance.findOneAndUpdate({ _id: tripId }, { userId });
    } catch (err) {
      throw err;
    }
  }
  async deleteTrip(tripId) {
    try {
      return await this.mongooseServiceInstance.delete(tripId);
    } catch (err) {
      throw err;
    }
  }
}
module.exports = TripService;
