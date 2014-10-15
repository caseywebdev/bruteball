import _ from 'underscore';
import app from 'index';
import config from 'config';
import gamePattern from 'patterns/games/show';
import p2 from 'p2';
import THREE from 'three';

var VELOCITY_DAMPING = 0.5;

// meters / second^2
var MS2 = 200;

var UP = new THREE.Vector3(0, 0, 1);

var MAP_SIZE = 16;

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
  game.stepIntervalId = setTimeout(_.partial(step, game), 1000 / config.game.sps);
  app.ws.server.broadcast('game', gamePattern(game));
};

var createBall = function () {
  var ball = new p2.Body({mass: 1});
  ball.addShape(new p2.Circle(0.5));
  ball.damping = VELOCITY_DAMPING;
  ball.fixedRotation = true;
  ball.position[0] = MAP_SIZE / 2;
  ball.position[1] = MAP_SIZE / 2;
  return ball;
};

var createWall = function (position, angle) {
  var wall = new p2.Body();
  wall.addShape(new p2.Plane());
  wall.position[0] = position[0];
  wall.position[1] = position[1];
  wall.angle = angle;
  return wall;
};

export var setAcceleration = function (game, user, x, y) {
  var ref = game.users[user.id];
  if (!ref) return;
  ref.acceleration.set(x, y).normalize();
};

export var addUser = function (game, user) {
  if (game.users[user.id]) return;
  var ref = game.users[user.id] = {
    info: user,
    ball: createBall(),
    acceleration: new THREE.Vector2(),
    matrix: new THREE.Matrix4()
  };
  game.world.addBody(ref.ball);
};

export var removeUser = function (game, user) {
  var ref = game.users[user.id];
  if (!ref) return;
  game.world.removeBody(ref.ball);
  delete game.users[user.id];
};

export var create = function () {
  var game = {
    users: {},
    world: new p2.World({gravity: [0, 0]}),
    lastStep: Date.now()
  };
  game.world.addBody(createWall([0, 0], 0));
  game.world.addBody(createWall([0, 0], -Math.PI / 2));
  game.world.addBody(createWall([MAP_SIZE, 0], Math.PI / 2));
  game.world.addBody(createWall([0, MAP_SIZE], Math.PI));
  step(game);
  return game;
};
