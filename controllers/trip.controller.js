const TripService = require("../services/trip.service");
const tripService = new TripService();

async function getTripDetail(req, res, next) {
  try {
    const trip = await tripService.getTripById(req.params.id);
    return res.status(200).json(trip);
  } catch (err) {
    next(err);
  }
}

async function getTrips(req, res, next) {
  try {
    //todo remove
    const userId = "5cabe64dcf0d4447fa60f5e2";
    const trips = await tripService.getTripsByUserId(userId);
    return res.status(200).json(trips);
  } catch (err) {
    next(err);
  }
}

//todo remove
async function createTrip(req, res, next) {
  try {
    const { trip } = req.body;
    const result = await tripService.createTrip(trip);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getTripDetail, getTrips, createTrip };
