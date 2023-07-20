const ChatService = require("../services/api/chat.service");
const chatServiceInstance = new ChatService();
const initialMessages = require("../data/chat.init.json");

async function sendMessage(req, res, next) {
  try {
    const message = await chatServiceInstance.sendMessage(req.body.conversation);
    return res.status(200).json(message);
  } catch (err) {
    throw err;
  }
}

async function getInitialMessages(req, res, next) {
  try {
    return res.status(200).json(initialMessages);
  } catch (err) {
    throw err;
  }
}

module.exports = { sendMessage, getInitialMessages };
