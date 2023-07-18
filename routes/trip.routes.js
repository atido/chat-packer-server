const express = require("express");
const router = express.Router();
const TripController = require("../controllers/trip.controller");

const { isAuthenticated } = require("../middleware/jwt.middleware");

// GET /trips/:id  - Get trip detail
router.get("/trips/:id", TripController.getTripDetail);

// GET  /trips - Get trips
router.get("/trips", TripController.getTrips);

router.post("/trips", TripController.createTrip);

module.exports = router;
