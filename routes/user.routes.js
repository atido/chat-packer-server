const express = require('express');
const router = express.Router();
const SignupController = require('../controllers/auth/signup.controller');
const LoginController = require('../controllers/auth/login.controller');
const UserController = require('../controllers/user.controller');

const fileUploader = require('../config/cloudinary.configuration');
const { isAuthenticated } = require('../middleware/jwt.middleware');

// POST /users  - Creates a new user in the database
router.post('/users/register', SignupController.createSignup);

// POST  /sessions - Verifies email and password and returns a JWT
router.post('/users/login', LoginController.login);

// GET  /user - Get user based on authent token
router.get('/user', isAuthenticated, UserController.getUser);

// POST  /user/uploadAvatar - upload avatar to cloudinary
router.post('/user/uploadAvatar', isAuthenticated, fileUploader.single('avatar'), UserController.uploadAvatar);

// put  /user/uploadAvatar - update user avatar
router.put('/user/avatar', isAuthenticated, UserController.updateAvatar);

// put  /user - update user
router.put('/user', isAuthenticated, UserController.updateUser);

module.exports = router;
