var _ = require('underscore');
var app = require('..');
var Game = require('../entities/game');

module.exports = function (socket) {
  var user = socket.user;
  if (!user) return;
  if (!_.any(_.map(app.ws.server.clients, 'user'), {id: user.id})) {
    Game.removeUser(app.games.test, user);
  }
};
