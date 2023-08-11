const { getAuthTokenFromHeaders, getConversationTokenFromHeaders } = require('../utils/request');
const jwt = require('jsonwebtoken');

function extractUser(req, res, next) {
  const token = getAuthTokenFromHeaders(req);
  if (token) {
    jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, data) => {
      if (!err) req.user = data.user;
    });
  }
  next();
}

function extractConversationToken(req, res, next) {
  req.conversationToken = getConversationTokenFromHeaders(req);
  next();
}
module.exports = { extractUser, extractConversationToken };
