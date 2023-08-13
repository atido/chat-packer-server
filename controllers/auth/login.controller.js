const bcrypt = require('bcrypt');
const AuthValidator = require('../../validators/auth.validators');
const UserService = require('../../services/user.service');
const userServiceInstance = new UserService();
const TripService = require('../../services/trip.service');
const tripServiceInstance = new TripService();
const { jwtSignUser } = require('../../utils/jwt');

async function login(req, res, next) {
  const { email, password } = req.body;

  const result = AuthValidator.validateLogin(email, password);
  if (!result.success) return res.status(400).json({ message: result.message });

  try {
    const foundUser = await userServiceInstance.getUserByEmail(email);
    if (foundUser && bcrypt.compareSync(password, foundUser.password)) {
      //Check if a trip is waiting in session
      if (req.sessionToken) {
        //attach trip to user  if founded
        await tripServiceInstance.attachTripFromSession(req.sessionToken, foundUser._id);
      }

      return res.status(200).json({ message: 'success login', authToken: jwtSignUser(foundUser) });
    } else {
      return res.status(401).json({ message: 'Unable to authenticate user' });
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { login };
