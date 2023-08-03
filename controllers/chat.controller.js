const ChatService = require('../services/api/chat.service');
const chatServiceInstance = new ChatService();

async function events(req, res, next) {
  try {
    const response = await chatServiceInstance.events(req.body, { id: req.sessionID, content: req.session });
    return res.status(200).json(response);
  } catch (err) {
    throw next(err);
  }
}

module.exports = { events };
