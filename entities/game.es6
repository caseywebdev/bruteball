var node = typeof window === 'undefined';

import _ from 'underscore';
import config from 'config';
import b2 from 'box2d';
import THREE from 'three';

var app = node ? require('index') : null;
var userPattern = node ? require('patterns/games/users/show').default : null;
var gamePattern = node ? require('patterns/games/show').default : null;

var UP = new THREE.Vector3(0, 0, 1);

var MAP_SIZE = 16;

var ACCELERATION = config.game.acceleration;
var SPS = 1000 / config.game.stepsPerSecond;
var VI = config.game.velocityIterations;
var PI = config.game.positionIterations;
var BROADCAST_WAIT = 1000 / config.game.broadcastsPerSecond;

var applyForce = function (dt, user) {
  var ball = user.ball;
  var a = user.acceleration;
  var force = new b2.b2Vec2(a.x * ACCELERATION, a.y * ACCELERATION);
  ball.ApplyForceToCenter(force);
  b2.destroy(force);
  if (!node) {
    var v2 = ball.GetLinearVelocity();
    var v3 = new THREE.Vector3(-v2.get_x(), v2.get_y(), 0);
    var theta = v3.length() * Math.PI * dt;
    var axis = v3.cross(UP).normalize();
    user.matrix = (new THREE.Matrix4())
      .makeRotationAxis(axis, theta)
      .multiply(user.matrix);
  }
};

var broadcastGame = function (game) {
  app.ws.server.broadcast('g', gamePattern(game));
  game.lastBroadcast = Date.now();
};

var broadcastUser = function (game, user) {
  var lastBroadcast = Math.max(game.lastBroadcast, user.lastBroadcast);
  if (user.needsBroadcast <= lastBroadcast) return;
  app.ws.server.broadcast('u', userPattern(user));
  user.lastBroadcast = Date.now();
};

export var step = function (game) {
  var now = Date.now();
  var dt = (now - game.lastStep) / 1000;
  _.each(game.users, _.partial(applyForce, dt));
  game.world.Step(dt, VI, PI);
  game.lastStep = now;
  clearInterval(game.stepIntervalId);
  game.stepIntervalId = setTimeout(_.partial(step, game), SPS);
  if (node) {
    if (game.needsBroadcast > game.lastBroadcast) broadcastGame(game);
    else _.each(game.users, _.partial(broadcastUser, game));
  }
};

var loopBroadcast = function (game) {
  game.needsBroadcast = Date.now();
  setTimeout(_.partial(loopBroadcast, game), BROADCAST_WAIT);
};

var createBall = function (game) {
  var bodyDef = new b2.b2BodyDef();
  bodyDef.set_type(b2.b2_dynamicBody);
  bodyDef.get_position().set_x(MAP_SIZE / 2);
  bodyDef.get_position().set_y(MAP_SIZE / 2);
  bodyDef.set_fixedRotation(true);
  bodyDef.set_linearDamping(config.game.linearDamping);
  var body = game.world.CreateBody(bodyDef);
  b2.destroy(bodyDef);

  var shape = new b2.b2CircleShape();
  shape.set_m_radius(0.5);
  body.CreateFixture(shape, 1);
  b2.destroy(shape);

  return body;
};

export var setAcceleration = function (game, user, x, y) {
  var ref = game.users[user.id];
  if (!ref || ref.acceleration.x === x && ref.acceleration.y === y) return;
  ref.acceleration.set(x, y).normalize();
  ref.needsBroadcast = Date.now();
};

export var addUser = function (game, user) {
  if (game.users[user.id]) return;
  game.users[user.id] = {
    info: user,
    ball: createBall(game),
    acceleration: new THREE.Vector2(),
    matrix: new THREE.Matrix4(),
    lastBroadcast: 0
  };
};

export var removeUser = function (game, user) {
  var ref = game.users[user.id];
  if (!ref) return;
  game.world.DestroyBody(ref.ball);
  delete game.users[user.id];
};

export var create = function () {
  var game = {
    users: {},
    world: new b2.b2World(),
    lastStep: Date.now(),
    lastBroadcast: 0
  };
  var bodyDef = new b2.b2BodyDef();
  var body = game.world.CreateBody(bodyDef);
  b2.destroy(bodyDef);
  var fixtureDef = new b2.b2FixtureDef();
  fixtureDef.set_restitution(0.25);
  var shape = b2.CreateLoopShape([
    {x: 0, y: 0},
    {x: MAP_SIZE, y: 0},
    {x: MAP_SIZE, y: MAP_SIZE},
    {x: 0, y: MAP_SIZE}
  ]);
  fixtureDef.set_shape(shape);
  body.CreateFixture(fixtureDef);
  b2.destroy(fixtureDef);
  b2.destroy(shape);
  loopBroadcast(game);
  step(game);
  return game;
};
