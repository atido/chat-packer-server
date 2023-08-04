const EventService = require('../services/event.service');
const eventServiceInstance = new EventService();

async function events(req, res, next) {
  try {
    //get the user from the middleware if present
    const userId = req.user ? req.user._id : null;
    const session = { id: req.sessionID, content: req.session };
    const response = await eventServiceInstance.events(req.body, session, userId);

    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    throw next(err);
  }
}

module.exports = { events };
