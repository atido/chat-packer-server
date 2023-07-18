const express = require("express");
const router = express.Router();
const SignupController = require("../controllers/auth/signup.controller");
const LoginController = require("../controllers/auth/login.controller");

const { isAuthenticated } = require("../middleware/jwt.middleware");

// POST /sessions  - Creates a new user in the database
router.post("/users", SignupController.createSignup);

// POST  /sessions - Verifies email and password and returns a JWT
router.post("/sessions", LoginController.login);

// GET  /session  -  Used to verify JWT stored on the client
router.get("/session", isAuthenticated, (req, res, next) => {
  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and is made available on `req.payload`

  // Send back the token payload object containing the user data
  res.status(200).json(req.payload);
});

module.exports = router;
