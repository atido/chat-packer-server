const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chat.controller');
const { extractUser, extractConversationToken } = require('../middleware/user.middleware');

// POST /chat  - Send the event and conversation to the chat api
router.post('/chat/events', extractUser, extractConversationToken, ChatController.events);

module.exports = router;
