const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AuthValidator = require('../../validators/auth.validators');

const UserService = require('../../services/user.service');
const userServiceInstance = new UserService();
const TripService = require('../../services/trip.service');
const tripServiceInstance = new TripService();

async function login(req, res, next) {
  const { email, password } = req.body;

  const result = AuthValidator.validateLogin(email, password);
  if (!result.success) return res.status(400).json({ message: result.message });

  try {
    const foundUser = await userServiceInstance.getUserByEmail(email);
    if (foundUser && bcrypt.compareSync(password, foundUser.password)) {
      const { _id, email, username, avatar } = foundUser;
      const payload = { user: { _id, username, email, avatar } };
      const authToken = jwt.sign(payload, process.env.JWT_TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: '6h',
      });
      //Check if a trip is waiting in session
      if (req.session.tripCreatedId) {
        await tripServiceInstance.attachTripToUser(req.session.tripCreatedId, foundUser._id);
        // reinit the trip et the state in session
        req.session.tripCreatedId = null;
        req.session.currentState = null;
      }
      return res.status(200).json({ authToken: authToken });
    } else {
      return res.status(401).json({ message: 'Unable to authenticate user' });
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { login };
