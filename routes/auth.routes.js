const express = require("express");
const router = express.Router();
const SignupController = require("../controllers/auth/signup.controller");
const LoginController = require("../controllers/auth/login.controller");

const { isAuthenticated } = require("../middleware/jwt.middleware");

// POST /auth/signup  - Creates a new user in the database
router.post("/signup", SignupController.createSignup);

// POST  /auth/login - Verifies email and password and returns a JWT
router.post("/login", LoginController.login);

// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get("/verify", isAuthenticated, (req, res, next) => {
  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and is made available on `req.payload`

  // Send back the token payload object containing the user data
  res.status(200).json(req.payload);
});

module.exports = router;
