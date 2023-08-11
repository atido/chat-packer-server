const EventService = require('../services/event.service');
const eventServiceInstance = new EventService();

async function init(req, res, next) {
  try {
    //get the user from the middleware if present
    const session = { id: req.sessionID, content: req.session };
    const response = await eventServiceInstance.events({ type: 'INIT' }, session, null);

    console.log('Session ID output : ', req.sessionID);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
}

async function events(req, res, next) {
  try {
    //get the user from the middleware if present
    const userId = req.user ? req.user._id : null;
    const session = { id: req.sessionID, content: req.session };
    console.log('conversationToken:', req.conversationToken);
    const conversationToken = req.conversationToken || req.sessionID;

    const conversation = await eventServiceInstance.events(req.body, session, userId);

    console.log('Session ID output : ', req.sessionID);
    return res.status(200).json({ token: conversationToken, conversation });
  } catch (err) {
    next(err);
  }
}

module.exports = { events, init };
