const { getTokenFromHeaders } = require('../utils/request');
const jwt = require('jsonwebtoken');

function extractUser(req, res, next) {
  const token = getTokenFromHeaders(req);
  if (token) {
    jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, data) => {
      if (!err) req.user = data.user;
    });
  }
  next();
}
module.exports = { extractUser };
