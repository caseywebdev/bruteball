var _ = require('underscore');
var broadcastUsers = require('../interactions/broadcast-users');

var FRICTION = 0.99;
var ACCELERATION = 0.25;

exports.create = function (users) {
  var game = {users: users};
  exports.step(game);
};

exports.step = function (game) {
  _.each(game.users, function (user) {
    user.x = (user.x || 0) +
      (user.dx = (user.dx || 0) * FRICTION +
        (user.left ? -ACCELERATION : 0) +
        (user.right ? ACCELERATION : 0));
    user.y = (user.y || 0) +
      (user.dy = (user.dy || 0) * FRICTION +
        (user.up ? -ACCELERATION : 0) +
        (user.down ? ACCELERATION : 0));
  });
  broadcastUsers();
  setTimeout(_.partial(exports.step, game), 33);
};
