const ChatService = require("../services/api/chat.service");
const chatServiceInstance = new ChatService();
const initialMessages = require("../data/chat.init.json");
const { addContentToConversation } = require("../utils/conversation");

/*async function sendConversation(req, res, next) {
  try {
    const { conversation, message } = req.body;

    const filteredConversation = conversation
      .filter((el) => el.component == "thread")
      .map((el) => el.body);

    const response = await chatServiceInstance.sendConversation(filteredConversation, message);

    //push back the user message and the response with good format
    conversation.push(
      { body: { role: "user", content: message }, component: "thread", id: crypto.randomUUID() },
      { body: response, component: "thread", id: crypto.randomUUID() }
    );
    return res.status(200).json(conversation);
  } catch (err) {
    throw err;
  }
}*/

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

    if (params.message)
      conversation = addContentToConversation(
        conversation,
        { role: "user", content: params.message },
        "thread"
      );

    const response = await chatServiceInstance.events(type, conversation);

    return res.status(200).json(response);
  } catch (err) {
    throw err;
  }
}

module.exports = { getInitialMessages, events };
