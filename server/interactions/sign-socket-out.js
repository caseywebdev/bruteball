var _ = require('underscore');
var app = require('..');
var broadcastUsers = require('./broadcast-users');
var User = require('../entities/user');

module.exports = function (socket) {
  var user = socket.user;
  if (!user) return;
  if (!_.any(app.ws.server.clients, {user: user})) User.remove(user);
  broadcastUsers();
};
