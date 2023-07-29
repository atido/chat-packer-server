const express = require("express");
const router = express.Router();
const SignupController = require("../controllers/auth/signup.controller");
const LoginController = require("../controllers/auth/login.controller");
const fileUploader = require("../config/cloudinary.config");
const User = require("../models/User.model");
const mongoose = require("mongoose");

const { isAuthenticated } = require("../middleware/jwt.middleware");

// POST /sessions  - Creates a new user in the database
router.post("/users", SignupController.createSignup);

// POST  /sessions - Verifies email and password and returns a JWT
router.post("/sessions", LoginController.login);

router.get("/user", isAuthenticated, (req, res, next) => {
  User.findById(req.payload.user._id)
    .then((userFromDB) => {
      res.json(userFromDB);
    })
    .catch((error) => next(error));
});

router.post(
  "/upload",
  isAuthenticated,
  fileUploader.single("avatar"),
  (req, res, next) => {
    console.log("file is: ", req.file);

    if (!req.file) {
      next(new Error("No file uploaded!"));
      return;
    }

    res.json({ fileUrl: req.file.path });
  }
);

router.put("/user", isAuthenticated, (req, res, next) => {
  User.findByIdAndUpdate(
    req.payload.user._id,
    { avatar: req.body.avatar },
    { new: true }
  )
    .then((updatedUser) => res.json(updatedUser))
    .catch((error) => next(error));
});

module.exports = router;
