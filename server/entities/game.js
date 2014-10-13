var _ = require('underscore');
var app = require('..');
var dump = require('../interactions/dump');
var p2 = require('p2');

var SPS = 1 / 30;

var applyAcceleration = function (user) {
  user.ball.applyForce(
    [user.acceleration.x * 10, user.acceleration.y * 10],
    user.ball.position
  );
};

var step = function (game) {
  _.each(game.users, applyAcceleration);
  var now = Date.now();
  game.world.step((now - game.lastStep) / 1000);
  game.lastStep = now;
  app.ws.server.broadcast('game', dump('games/show', game));
  game.stepIntervalId = setTimeout(_.partial(step, game), SPS * 1000);
};

var createBall = function () {
  var ball = new p2.Body({mass: 1});
  ball.addShape(new p2.Circle(1));
  return ball;
};

exports.setAcceleration = function (game, user, acceleration) {
  var ref = game.users[user.id];
  if (!ref) return;
  ref.acceleration = acceleration;
};

exports.addUser = function (game, user) {
  if (game.users[user.id]) return;
  var ref = game.users[user.id] = {
    info: user,
    ball: createBall(),
    acceleration: {x: 0, y: 0}
  };
  game.world.addBody(ref.ball);
};

exports.removeUser = function (game, user) {
  var ref = game.users[user.id];
  if (!ref) return;
  game.world.removeBody(ref.ball);
  delete game.users[user.id];
};

exports.create = function () {
  var game = {
    users: {},
    world: new p2.World({gravity: [0, 0]}),
    lastStep: Date.now()
  };
  step(game);
  return game;
};
