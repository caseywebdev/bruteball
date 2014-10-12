var _ = require('underscore');
var app = require('..');
var dump = require('./dump');
var User = require('../entities/user');

module.exports = function () {
  var users = _.map(User.all, _.partial(dump, 'users/show'));
  app.ws.server.broadcast('users', users);
};
