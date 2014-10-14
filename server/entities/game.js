var _ = require('underscore');
var app = require('..');
var dump = require('../interactions/dump');
var p2 = require('p2');
var THREE = require('three');

var SPS = 1 / 30;

var VELOCITY_DAMPING = 0.5;

// meters / second^2
var MS2 = 100;

var UP = new THREE.Vector3(0, 0, 1);

var applyAcceleration = function (dt, user) {
  var ball = user.ball;
  var a = user.acceleration;
  var force = a.clone().multiplyScalar(MS2 * dt);
  ball.applyForce([force.x, force.y], ball.position);
  var v = new THREE.Vector3(-ball.velocity[0], ball.velocity[1], 0);
  var theta = v.length() * Math.PI * dt;
  var axis = v.cross(UP).normalize();
  user.matrix =
    (new THREE.Matrix4()).makeRotationAxis(axis, theta).multiply(user.matrix);
};

var step = function (game) {
  var now = Date.now();
  var dt = (now - game.lastStep) / 1000;
  _.each(game.users, _.partial(applyAcceleration, dt));
  game.world.step(dt);
  game.lastStep = now;
  app.ws.server.broadcast('game', dump('games/show', game));
  game.stepIntervalId = setTimeout(_.partial(step, game), SPS * 1000);
};

var createBall = function () {
  var ball = new p2.Body({mass: 1});
  ball.addShape(new p2.Circle(0.5));
  ball.damping = VELOCITY_DAMPING;
  ball.fixedRotation = true;
  return ball;
};

exports.setAcceleration = function (game, user, x, y) {
  var ref = game.users[user.id];
  if (!ref) return;
  ref.acceleration.set(x, y).normalize();
};

exports.addUser = function (game, user) {
  if (game.users[user.id]) return;
  var ref = game.users[user.id] = {
    info: user,
    ball: createBall(),
    acceleration: new THREE.Vector2(),
    matrix: new THREE.Matrix4()
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
