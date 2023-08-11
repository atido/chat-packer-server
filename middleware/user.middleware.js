const { getAuthTokenFromHeaders, getConversationTokenFromHeaders, getSessionTokenFromHeaders } = require('../utils/request');
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

function extractSessionToken(req, res, next) {
  req.sessionToken = getSessionTokenFromHeaders(req);
  next();
}
module.exports = { extractUser, extractSessionToken };
