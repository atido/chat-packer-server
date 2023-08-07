const jwt = require('jsonwebtoken');

function jwtSignUser(user) {
  const { _id, email, username, avatar } = user;
  const payload = { user: { _id, username, email, avatar } };
  return jwt.sign(payload, process.env.JWT_TOKEN_SECRET, {
    algorithm: 'HS256',
    expiresIn: '6h',
  });
}

module.exports = { jwtSignUser };
