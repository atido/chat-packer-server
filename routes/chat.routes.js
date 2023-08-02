const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chat.controller');

// POST /chat  - Send the event and conversation to the chat api
router.post('/chat/events', ChatController.events);

module.exports = router;
