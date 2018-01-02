const jwt = require('jsonwebtoken');

module.exports = (key, subject, obj) => jwt.sign(obj, key, {subject});
