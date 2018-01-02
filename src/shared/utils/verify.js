const jwt = require('jsonwebtoken');

module.exports = (key, subject, token, maxAge) => {
  try { return jwt.verify(token, key, {subject, maxAge}); } catch (er) {}
};
