const TripModel = require("../models/Trip.model");
const MongooseService = require("./mongoose.service");
const PhotoService = require("./api/photo.service");

class TripService {
  constructor() {
    this.mongooseService = new MongooseService(TripModel);
    this.photoService = new PhotoService();
  }

  async getTripById(id) {
    try {
      return await this.mongooseService.findById(id);
    } catch (err) {
      throw err;
    }
  }
  async getTripsByUserId(userId) {
    try {
      return await this.mongooseService.find({ userId });
    } catch (err) {
      throw err;
    }
  }
  async createTrip(userId, tripInfo, flight, accomodation) {
    try {
      const { photo } = await this.photoService.getRandomPhoto(tripInfo.destinationCity);
      return await this.mongooseService.create({
        userId,
        tripInfo,
        flight,
        accomodation,
        destinationPhoto: photo,
      });
    } catch (err) {
      throw err;
    }
  }
}
module.exports = TripService;
