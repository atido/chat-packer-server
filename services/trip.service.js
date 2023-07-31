const TripModel = require('../models/Trip.model');
const MongooseService = require('./mongoose.service');
const PhotoService = require('./api/photo.service');

class TripService {
  constructor() {
    this.mongooseService = new MongooseService(TripModel);
    this.photoService = new PhotoService();
  }

  async getTripsByUserId(userId) {
    try {
      return await this.mongooseService.find({ userId }, { tripInfo: 1, destinationPhoto: 1 });
    } catch (err) {
      throw err;
    }
  }
  async getTripById(_id, userId) {
    try {
      const res = await this.mongooseService.findOneWithPopulate({ _id, userId }, '', ['flight', 'accommodation']);
      return res;
    } catch (err) {
      throw err;
    }
  }
  async createTrip(userId, tripInfo, flightId, accommodationId) {
    try {
      const { photo } = await this.photoService.getRandomPhoto(tripInfo.destinationCity);
      return await this.mongooseService.create({
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
}
module.exports = TripService;
