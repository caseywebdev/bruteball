import _ from 'underscore';
import b2 from 'box2d';
import Bomb from 'shared/objects/bomb';
import config from 'shared/config';
import Wall from 'shared/objects/wall';

var app = config.node ? require('index') : null;
var gamePattern = config.node ? require('patterns/games/show').default : null;
var THREE = config.node ? null : require('three');

var MAP_SIZE = 32;

var SPS = 1000 / config.game.stepsPerSecond;
var VI = config.game.velocityIterations;
var PI = config.game.positionIterations;
var BROADCAST_WAIT = 1000 / config.game.broadcastsPerSecond;

var broadcastAll = function (game) {
  game.lastBroadcast = Date.now();
  app.ws.server.broadcast('g', gamePattern(game));
};

var invoke = function (game, key) {
  _.each(game.objects, function (object) {
    var Type = require('shared/objects/' + object.type);
    if (Type[key]) Type[key](object);
  });
};

export var step = function (game) {
  clearTimeout(game.stepTimeoutId);
  game.stepTimeoutId = _.delay(_.partial(step, game), SPS);
  var now = Date.now();
  var delta = now - game.lastStep;
  game.lastStep = now;
  var dt = delta / 1000;
  invoke(game, 'preStep');
  game.world.Step(dt, VI, PI);
  invoke(game, 'postStep');
  if (config.node && game.needsBroadcast > game.lastBroadcast) {
    broadcastAll(game);
  }
};

var loopBroadcast = function (game) {
  game.needsBroadcast = Date.now();
  game.broadcastTimeoutId =
    _.delay(_.partial(loopBroadcast, game), BROADCAST_WAIT);
};

export var setAcceleration = function (game, user, x, y) {
  var ref = findObject(game, {type: 'user', id: user.id});
  if (!ref || ref.acceleration.x === x && ref.acceleration.y === y) return;
  ref.acceleration.Set(x, y);
  ref.acceleration.Normalize();
  app.ws.server.broadcast('g', gamePattern(game, {users: [ref]}));
};

export var findObject = function (game, object) {
  return _.find(game.objects, _.pick(object, 'type', 'id'));
};

export var createObject = function (game, options) {
  var existing = findObject(game, options);
  if (options.id && existing) return existing;
  var Type = require('shared/objects/' + options.type);
  var object = Type.create(_.extend({game: game}, options), game);
  game.objects = game.objects.concat(object);
  return object;
};

export var destroyObject = function (game, options) {
  var existing = _.find(game, options);
  if (!existing) return;
  require('shared/objects/' + options.type).destroy(existing);
  game.objects = _.without(game.objects, existing);
  return existing;
};

var handleCollision = function (game, a, b) {
  if (a.type === 'boost' && b.type === 'user') {
    var velocity = b.body.GetLinearVelocity();
    var force = new b2.b2Vec2(velocity.get_x(), velocity.get_y());
    force.Normalize();
    force.Set(force.get_x() * 15, force.get_y() * 15);
    b.body.ApplyLinearImpulse(force);
    b2.destroy(force);
  } else if (a.type === 'bomb') {
    Bomb.explode(a);
  }
};

export var create = function () {
  var game = {
    incr: 0,
    objects: [],
    world: new b2.b2World(),
    scene: config.node ? null : new THREE.Scene(),
    lastStep: Date.now(),
    lastBroadcast: 0
  };
  _.each([{
    type: 'wall',
    x: 0,
    y: 0,
    points: [
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 1, y: MAP_SIZE},
      {x: 0, y: MAP_SIZE}
    ]
  }, {
    type: 'wall',
    x: MAP_SIZE - 1,
    y: 0,
    points: [
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 1, y: MAP_SIZE},
      {x: 0, y: MAP_SIZE}
    ]
  }, {
    type: 'wall',
    x: 1,
    y: 0,
    points: [
      {x: 0, y: 0},
      {x: MAP_SIZE - 2, y: 0},
      {x: MAP_SIZE - 2, y: 1},
      {x: 0, y: 1}
    ]
  }, {
    type: 'wall',
    x: 1,
    y: MAP_SIZE - 1,
    points: [
      {x: 0, y: 0},
      {x: MAP_SIZE - 2, y: 0},
      {x: MAP_SIZE - 2, y: 1},
      {x: 0, y: 1}
    ]
  },
    {type: 'wall', x: 4, y: 6, points: Wall.WITHOUT_TOP_RIGHT},
    {type: 'wall', x: 5, y: 6},
    {type: 'wall', x: 4, y: 5, points: Wall.WITHOUT_BOTTOM_LEFT},
    {type: 'wall', x: 6, y: 6, points: Wall.WITHOUT_TOP_LEFT},
    {type: 'wall', x: 6, y: 5, points: Wall.WITHOUT_BOTTOM_RIGHT},
    {type: 'wall', x: 4, y: 3, points: Wall.WITHOUT_BOTTOM_RIGHT},
    {type: 'wall', x: 4, y: 4, points: Wall.WITHOUT_TOP_LEFT},
    {type: 'wall', x: 6, y: 4, points: Wall.WITHOUT_TOP_RIGHT},
    {type: 'wall', x: 6, y: 3, points: Wall.WITHOUT_BOTTOM_LEFT},
    {type: 'boost', x: 10, y: 10},
    {type: 'bomb', x: 8, y: 5},
  ], _.partial(createObject, game));

  var listener = new b2.JSContactListener();
  listener.BeginContact = function (contactPtr) {
    var contact = b2.wrapPointer(contactPtr, b2.b2Contact);
    var objects = _.sortBy([
      _.find(game.objects, {body: contact.GetFixtureA().GetBody()}),
      _.find(game.objects, {body: contact.GetFixtureB().GetBody()})
    ], 'type');
    handleCollision(game, objects[0], objects[1]);
  };
  listener.EndContact = listener.PreSolve = listener.PostSolve = _.noop;
  game.world.SetContactListener(listener);

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
