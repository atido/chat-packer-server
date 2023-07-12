const express = require("express");
const router = express.Router();

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// middleware is Authenticated
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

router.put("/users", isAuthenticated, (req, res, next) => {
  const { image } = req.body;

  User.findOneAndUpdate({ username: req.payload.username }, { image })
    .then((userUpdated) => res.status(204).json(userUpdated))
    .catch((err) => next(err));
});

router.get("/users", isAuthenticated, (req, res, next) => {
  User.findOne({ username: req.payload.username })
    .then((currentUser) => res.status(200).json(currentUser))
    .catch((err) => next(err));
});

/*router.post("/upload", (req, res, next) => {
    User.findOne({ username })
      .then((currentUser) => res.status(200).json(currentUser))
      .catch((err) => next(err));
  });*/

module.exports = router;
