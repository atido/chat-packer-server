const express = require('express');
const router = express.Router();
const TripController = require('../controllers/trip.controller');
const mongoose = require("mongoose")

const { isAuthenticated } = require('../middleware/jwt.middleware');

// GET /trips/:id  - Get trip detail
router.get('/trips/:id', isAuthenticated, TripController.getTripDetail);

// GET  /trips - Get trips
router.get('/trips', isAuthenticated, TripController.getTrips);

// DELETE  /api/projects/:projectId  -  Deletes a specific trip by id
router.delete('/trips/:id', isAuthenticated, TripController.deleteTrip)

module.exports = router;
