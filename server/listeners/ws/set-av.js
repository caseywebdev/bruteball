var app = require('../..');
var Game = require('../../entities/game');

module.exports = function (socket, av, cb) {
  var ax = parseInt(av.x);
  var ay = parseInt(av.y);
  if (!socket.user || isNaN(ax) || isNaN(ay)) return cb();
  var d = Math.sqrt((ax * ax) + (ay * ay));
  var acceleration = {x: d && ax / d, y: d && ay / d};
  Game.setAcceleration(app.games.test, socket.user, acceleration);
  cb();
};
