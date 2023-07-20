const express = require("express");
const router = express.Router();
const ChatController = require("../controllers/chat.controller");

// POST /chat  - Creates a new user in the database
router.post("/chat", ChatController.sendMessage);

// GET /chat/init  - Creates a new user in the database
router.get("/chat", ChatController.getInitialMessages);

module.exports = router;
