var broadcast = require('./broadcast');
var User = require('../entities/user');

module.exports = function () {
  broadcast('users', User.all);
};
