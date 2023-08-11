const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chat.controller');
const { extractUser, extractSessionToken } = require('../middleware/user.middleware');

// POST /chat  - Send the event and conversation to the chat api
router.post('/chat/events', extractUser, extractSessionToken, ChatController.events);

module.exports = router;
