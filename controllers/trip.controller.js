const TripService = require('../services/trip.service');
const tripServiceInstance = new TripService();

async function getTripDetail(req, res, next) {
  try {
    const trip = await tripServiceInstance.getTripById(req.params.id, req.payload.user._id);
    return res.status(200).json(trip || {});
  } catch (err) {
    next(err);
  }
}

async function getTrips(req, res, next) {
  try {
    const trips = await tripServiceInstance.getTripsByUserId(req.payload.user._id);
    return res.status(200).json(trips || []);
  } catch (err) {
    next(err);
  }
}

async function deleteTrip(req, res, next) {
  try {
    const trip = await tripServiceInstance.deleteTrip(req.params.id, req.payload.user._id);
    return res.status(200).json(trip || {});
  } catch (err) {
    next(err);
  }
}

module.exports = { getTripDetail, getTrips, deleteTrip };
