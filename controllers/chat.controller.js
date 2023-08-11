const EventService = require('../services/event.service');
const eventServiceInstance = new EventService();

async function events(req, res, next) {
  try {
    //get the user from the middleware if present
    const userId = req.user ? req.user._id : null;
    const session = { id: req.sessionID, content: req.session };
    console.log('conversationToken before:', req.conversationToken);
    const conversationToken = req.conversationToken || req.sessionID;

    const conversation = await eventServiceInstance.events(req.body, session, userId);

    console.log('conversationToken after:', conversationToken);
    return res.status(200).json({ token: conversationToken, conversation });
  } catch (err) {
    next(err);
  }
}

module.exports = { events };
