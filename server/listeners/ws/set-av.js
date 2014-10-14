var app = require('../..');
var Game = require('../../entities/game');

module.exports = function (socket, av, cb) {
  var ax = parseInt(av.x);
  var ay = parseInt(av.y);
  if (!socket.user || isNaN(ax) || isNaN(ay)) return cb();
  Game.setAcceleration(app.games.test, socket.user, ax, ay);
  cb();
};
