const EventService = require('../services/event.service');
const eventServiceInstance = new EventService();

async function events(req, res, next) {
  try {
    //get the user from the middleware if present
    const userId = req.user ? req.user._id : null;
    const response = await eventServiceInstance.events(req.body, req.sessionToken, userId);

    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
}

module.exports = { events };
