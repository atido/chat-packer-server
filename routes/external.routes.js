const express = require("express");
const router = express.Router();

const AccommodationService = require("../services/api/accommodation.service");
const accommodationServiceInstance = new AccommodationService();

const PhotoService = require("../services/api/photo.service");
const photoServiceInstance = new PhotoService();

const FlightService = require("../services/api/flight.service");
const flightServiceInstance = new FlightService();

const ChatService = require("../services/api/chat.service");
const chatServiceInstance = new ChatService();

router.get("/accommodations", async (req, res, next) => {
  const { location, checkin, checkout, adultsNb } = req.query;
  const result = await accommodationServiceInstance.searchAccommodations(
    location,
    checkin,
    checkout,
    adultsNb
  );
  res.status(200).json(result);
});

router.get("/flights", async (req, res, next) => {
  const { adultsNb, originIATA, destinationIATA, departureDate, returnDate } = req.query;
  const result = await flightServiceInstance.searchFlights(
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

router.post("/chat/extract", async (req, res, next) => {
  const result = await chatServiceInstance.extractTripInfo(req.body);
  res.status(200).json(result);
});

router.post("/chat/detectPositiveSentiment", async (req, res, next) => {
  const { conversation } = req.body;
  const result = await chatServiceInstance.checkIfUserAgree(conversation);
  res.status(200).json(result);
});

router.get("/chat/ask", async (req, res, next) => {
  const result = await chatServiceInstance.askToChatGPT([], {
    systemMessage: `You are a travel agent. Ask the user if they would like assistance in finding the best accommodations for their trip. You are free to modify how you inquire. Do not include greeting.`,
    temperature: 1,
    maxTokens: 50,
    entities: "",
  });
  res.status(200).json(result);
});

router.post("/chat/stateMachine", async (req, res, next) => {
  const { conversation, type } = req.body;
  const result = await chatServiceInstance.events(type, conversation);
  res.status(200).json(result);
});

module.exports = router;
