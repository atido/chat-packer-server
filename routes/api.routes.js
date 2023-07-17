const express = require("express");
const router = express.Router();

const AccomodationService = require("../api/services/accommodation.service");
const accomodationServiceInstance = new AccomodationService();

const PhotoService = require("../api/services/photo.service");
const photoServiceInstance = new PhotoService();

const FlightService = require("../api/services/flight.service");
const flightServiceInstance = new FlightService();

const ChatService = require("../api/services/chat.service");
const chatServiceInstance = new ChatService();

router.get("/accomodations", async (req, res, next) => {
  const { location, checkin, checkout, adultsNb } = req.query;
  const result = await accomodationServiceInstance.getAccomodations(
    location,
    checkin,
    checkout,
    adultsNb
  );
  res.status(200).json(result);
});

router.get("/flights", async (req, res, next) => {
  const { adultsNb, originIATA, destinationIATA, departureDate, returnDate } = req.query;
  const result = await flightServiceInstance.getFlights(
    adultsNb,
    originIATA,
    destinationIATA,
    departureDate,
    returnDate
  );
  res.status(200).json(result);
});

router.get("/randomPhoto", async (req, res, next) => {
  const { query } = req.query;
  const result = await photoServiceInstance.getRandomPhoto(query);
  res.status(200).json(result);
});

router.post("/chat", async (req, res, next) => {
  const { conversation } = req.body;
  console.log(conversation);
  const result = await chatServiceInstance.sendMessage(conversation);
  res.status(200).json(result);
});

module.exports = router;
