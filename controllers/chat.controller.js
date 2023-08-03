const ChatService = require('../services/api/chat.service');
const chatServiceInstance = new ChatService();

async function events(req, res, next) {
  try {
    //get the user from the middleware if present
    const userId = req.user ? req.user._id : null;
    const session = { id: req.sessionID, content: req.session };
    const response = await chatServiceInstance.events(req.body, session, userId);
    console.log(session);
    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    throw next(err);
  }
}

module.exports = { events };
