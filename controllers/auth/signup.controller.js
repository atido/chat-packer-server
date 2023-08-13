const UserService = require('../../services/user.service');
const userServiceInstance = new UserService();
const AuthValidator = require('../../validators/auth.validators');
const TripService = require('../../services/trip.service');
const tripServiceInstance = new TripService();
const { jwtSignUser } = require('../../utils/jwt');

async function createSignup(req, res, next) {
  const { email, password, username } = req.body;

  const result = AuthValidator.validateSignup(email, password, username);
  if (!result.success) return res.status(400).json({ message: result.message });

  try {
    const isUserExist = await userServiceInstance.checkIfUserExist(username, email);
    if (isUserExist) return res.status(400).json({ message: 'User already exists.' });

    const createdUser = await userServiceInstance.createUser(email, password, username, process.env.AVATAR_DEFAULT_URL);
    if (req.sessionToken) {
      //attach trip to user  if founded
      await tripServiceInstance.attachTripFromSession(req.sessionToken, createdUser._id);
    }

    return res.status(200).json({ message: 'success signup', authToken: jwtSignUser(createdUser) });
  } catch (err) {
    next(err);
  }
}

module.exports = { createSignup };
