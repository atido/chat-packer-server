const ChatService = require('../services/api/chat.service');
const chatServiceInstance = new ChatService();
const initialMessages = require('../data/chat.init.json');
const { addContentToConversation } = require('../utils/conversation');

async function getInitialMessages(req, res, next) {
  try {
    return res.status(200).json(initialMessages);
  } catch (err) {
    throw err;
  }
}

async function events(req, res, next) {
  try {
    const { type, params } = req.body;
    let { conversation } = req.body;

    if (params.message) conversation = addContentToConversation(conversation, { role: 'user', content: params.message }, 'thread');

    const response = await chatServiceInstance.events(type, conversation);

    return res.status(200).json(response);
  } catch (err) {
    throw err;
  }
}

module.exports = { getInitialMessages, events };
