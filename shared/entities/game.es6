import _ from 'underscore';
import b2 from 'box2d';
import Ball from 'shared/entities/ball';
import config from 'shared/config';
import Wall from 'shared/entities/wall';

var app = config.node ? require('index') : null;
var gamePattern = config.node ? require('patterns/games/show').default : null;
var THREE = config.node ? null : require('three');

var MAP_SIZE = 16;

var ACCELERATION = config.game.acceleration;
var SPS = 1000 / config.game.stepsPerSecond;
var VI = config.game.velocityIterations;
var PI = config.game.positionIterations;
var BROADCAST_WAIT = 1000 / config.game.broadcastsPerSecond;

var applyForce = function (dt, user) {
  var speed = user.ball.body.GetLinearVelocity().Length();
  var delta = Math.min(config.game.maxSpeed - speed, ACCELERATION) / dt;
  if (delta <= 0) return;
  var force = new b2.b2Vec2(
    user.acceleration.get_x() * delta,
    user.acceleration.get_y() * delta
  );
  user.ball.body.ApplyForceToCenter(force);
  b2.destroy(force);
};

var broadcastAll = function (game) {
  game.lastBroadcast = Date.now();
  app.ws.server.broadcast('g', gamePattern(game));
};

var broadcastWaiting = function (game) {
  var now = Date.now();
  var waiting = _.filter(game.users, function (user) {
    var lastBroadcast = Math.max(game.lastBroadcast, user.lastBroadcast);
    if (user.needsBroadcast <= lastBroadcast) return;
    user.lastBroadcast = now;
    return true;
  });
  if (!waiting.length) return;
  app.ws.server.broadcast('g', gamePattern(game, {users: waiting}));
};

export var step = function (game) {
  if (config.node) {
    clearTimeout(game.stepTimeoutId);
    game.stepTimeoutId = setTimeout(_.partial(step, game), SPS);
  }
  var now = Date.now();
  var dt = (now - game.lastStep) / 1000;
  game.lastStep = now;
  _.each(game.users, _.partial(applyForce, dt));
  game.world.Step(dt, VI, PI);
  if (!config.node) {
    _.each(_.map(game.users, 'ball'), _.partial(Ball.updateMesh, _, dt));
  }
  if (config.node) {
    game.needsBroadcast > game.lastBroadcast ?
    broadcastAll(game) :
    broadcastWaiting(game);
  }
};

var loopBroadcast = function (game) {
  game.needsBroadcast = Date.now();
  game.broadcastTimeoutId =
    setTimeout(_.partial(loopBroadcast, game), BROADCAST_WAIT);
};

export var setAcceleration = function (game, user, x, y) {
  var ref = game.users[user.id];
  if (!ref || ref.acceleration.x === x && ref.acceleration.y === y) return;
  ref.acceleration.Set(x, y);
  ref.acceleration.Normalize();
  ref.needsBroadcast = Date.now();
};

export var addUser = function (game, user) {
  if (game.users[user.id]) return;
  var ball = Ball.create(game);
  var position = ball.body.GetPosition();
  position.Set(MAP_SIZE / 2, MAP_SIZE / 2);
  ball.body.SetTransform(position, ball.body.GetAngle());
  game.users[user.id] = {
    info: user,
    ball: ball,
    acceleration: new b2.b2Vec2(),
    lastBroadcast: 0,
    needsBroadcast: 0
  };
};

export var removeUser = function (game, user) {
  var ref = game.users[user.id];
  if (!ref) return;
  Ball.destroy(ref.ball, game);
  b2.destroy(ref.acceleration);
  delete game.users[user.id];
};

export var create = function () {
  var now = Date.now();
  var game = {
    users: {},
    world: new b2.b2World(),
    scene: config.node ? null : new THREE.Scene(),
    walls: [],
    lastStep: now,
    lastBroadcast: 0
  };
  game.walls.push(
    Wall.create({game: game, x: 3, y: 3, points: Wall.WITHOUT_BOTTOM_LEFT}),
    Wall.create({game: game, x: 3, y: 4}),
    Wall.create({game: game, x: 3, y: 5}),
    Wall.create({game: game, x: 3, y: 6}),
    Wall.create({game: game, x: 3, y: 7}),
    Wall.create({game: game, x: 4, y: 3}),
    Wall.create({game: game, x: 5, y: 3}),
    Wall.create({game: game, x: 6, y: 3}),
    Wall.create({game: game, x: 4, y: 4, points: Wall.WITHOUT_TOP_RIGHT}),
    Wall.create({game: game, x: 7, y: 3, points: Wall.WITHOUT_BOTTOM_RIGHT}),
    Wall.create({game: game, x: 7, y: 4, points: Wall.WITHOUT_TOP_LEFT}),
    Wall.create({game: game, x: 8, y: 4}),
    Wall.create({game: game, x: 9, y: 4, points: Wall.WITHOUT_TOP_RIGHT}),
    Wall.create({game: game, x: 9, y: 3, points: Wall.WITHOUT_BOTTOM_LEFT})
  );
  var bodyDef = new b2.b2BodyDef();
  var body = game.world.CreateBody(bodyDef);
  b2.destroy(bodyDef);
  var fixtureDef = new b2.b2FixtureDef();
  fixtureDef.set_restitution(0.25);
  var shape = new b2.b2ChainShape();
  var vertices = [
    {x: 0, y: 0},
    {x: MAP_SIZE, y: 0},
    {x: MAP_SIZE, y: MAP_SIZE},
    {x: 0, y: MAP_SIZE}
  ];
  shape.CreateLoop(b2.CreateVerticesPointer(vertices), vertices.length);
  fixtureDef.set_shape(shape);
  body.CreateFixture(fixtureDef);
  b2.destroy(fixtureDef);
  b2.destroy(shape);
  return game;
};

export var start = function (game) {
  loopBroadcast(game);
  step(game);
};

export var stop = function (game) {
  clearTimeout(game.broadcastTimeoutId);
  clearTimeout(game.stepTimeoutId);
};
