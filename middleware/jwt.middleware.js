const { expressjwt: jwt } = require('express-jwt');
const { getTokenFromHeaders } = require('../utils/request');

// Instantiate the JWT token validation middleware
const isAuthenticated = jwt({
  secret: process.env.JWT_TOKEN_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'payload',
  getToken: getTokenFromHeaders,
});

// Export the middleware so that we can use it to create protected routes
module.exports = { isAuthenticated };
