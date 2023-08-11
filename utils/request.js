// Function used to extract the JWT token from the request's 'Authorization' Headers
function getAuthTokenFromHeaders(req) {
  // Check if the token is available on the request Headers
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    // Get the encoded token string and return it
    const token = req.headers.authorization.split(' ')[1];
    return token;
  }
  return null;
}

// Function used to extract conversation token from the request's 'X-conversation-token' Headers
function getSessionTokenFromHeaders(req) {
  return req.headers['x-session-token'];
}

module.exports = { getAuthTokenFromHeaders, getSessionTokenFromHeaders };
