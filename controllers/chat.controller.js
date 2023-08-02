const ChatService = require('../services/api/chat.service');
const chatServiceInstance = new ChatService();

async function events(req, res, next) {
  try {
    const { type, message } = req.body;

    if (!req.session.currentState) {
      console.log('absent de la session');
      req.session.currentState = { state: 'initial' };
    } else console.log('current state in session:', req.session.currentState);

    const response = await chatServiceInstance.events(type, message);
    return res.status(200).json(response);
  } catch (err) {
    throw next(err);
  }
}

module.exports = { events };
