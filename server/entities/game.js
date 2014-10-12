var _ = require('underscore');
var broadcastUsers = require('../interactions/broadcast-users');
var p2 = require('p2');

var SPS = 1 / 30;

var applyForce = function (game, user) {
  var body = game.userBodies[user.id];
  if (!body) {
    body = game.userBodies[user.id] = new p2.Body({
      mass: 1,
      position: [0, 0],
      angle: 0,
      velocity: [0, 0],
      angularVelocity: 0
    });
    // Add a circular shape to the body
    body.addShape(new p2.Circle(1));
    game.world.addBody(body);
  }
  if (user.ax || user.ay) {
    body.applyForce([user.ax * 10, user.ay * 10], body.position);
  }
  user.x = body.position[0];
  user.y = body.position[1];
};

var step = function (game) {
  _.each(
    _.omit(game.userBodies, _.map(game.users, 'id')),
    game.world.removeBody,
    game.world
  );
  _.each(game.users, _.partial(applyForce, game));
  var now = Date.now();
  game.world.step((now - game.lastStep) / 1000);
  game.lastStep = now;
  broadcastUsers();
  setTimeout(_.partial(step, game), SPS * 1000);
};

exports.create = function (users) {
  var game = {
    users: users,
    userBodies: {},
    world: new p2.World({gravity: [0, 0]}),
    lastStep: Date.now()
  };
  var body = new p2.Body({
    mass: 1,
    position: [0, 0],
    angle: 0,
    velocity: [0, 0],
    angularVelocity: 0
  });

  // Add a circular shape to the body
  body.addShape(new p2.Circle(1));
  game.world.addBody(body);
  step(game);
};
