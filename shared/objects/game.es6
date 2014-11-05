import _ from 'underscore';
import b2 from 'box2d';
import Bomb from 'shared/objects/bomb';
import Boost from 'shared/objects/boost';
import config from 'shared/config';
import stdDev from 'shared/utils/standard-deviation';
import Wall from 'shared/objects/wall';

var app = config.node ? require('index') : null;
var gamePattern = config.node ? require('patterns/games/show').default : null;
var THREE = config.node ? null : require('three');

var MAP_SIZE = 32;

var DT = config.game.dt;
var DT_MS = DT * 1000;
var PI = config.game.positionIterations;
var STEPS_PER_BROADCAST = config.game.stepsPerBroadcast;
var JITTERS_TO_HOLD = 100;
var VI = config.game.velocityIterations;

var broadcastAll = function (game) {
  if (config.node) app.ws.server.broadcast('g', gamePattern(game));
};

var invoke = function (game, key) {
  _.each(game.objects, function (object) {
    var Type = require('shared/objects/' + object.type);
    if (Type[key]) Type[key](object);
  });
};

var updateUser = function (game, u) {
  var id = u[0];
  var user = createObject(game, {type: 'user', id: id});
  var position = user.body.GetPosition();
  position.Set(u[1], u[2]);
  user.body.SetTransform(position, user.body.GetAngle());
  var velocity = user.body.GetLinearVelocity();
  velocity.Set(u[3], u[4]);
  user.body.SetLinearVelocity(velocity);
  user.acceleration.Set(u[5], u[6]);
};

export var applyFrame = function (game, g) {
  game.step = g.s;
  _.each(g.u, _.partial(updateUser, game));
};

var needsFrame = function (game) {
  var frames = game.frames;
  return !!frames.length && game.step >= frames[0].s;
};

export var getStepBuffer = function (game) {
  return Math.max(0, Math.ceil((2 * stdDev(game.jitters) / 1000) / DT ));
};

var needsCatchup = function (game) {
  var frames = game.frames;
  return !!frames.length && game.step < _.last(frames).s - getStepBuffer(game);
};

export var step = function (game) {
  if (config.node) {
    game.stepTimeoutId = _.defer(_.partial(step, game));
    if ((Date.now() - game.start) / DT_MS < game.step) return;
  } else if (getStepBuffer(game) === 0) return;
  if (game.step % STEPS_PER_BROADCAST === 0) broadcastAll(game);
  while (needsFrame(game)) applyFrame(game, game.frames.shift());
  ++game.step;
  invoke(game, 'preStep');
  game.world.Step(DT, VI, PI);
  invoke(game, 'postStep');
  if (needsCatchup(game)) step(game);
};

export var setAcceleration = function (game, user, x, y) {
  var ref = findObject(game, {type: 'user', id: user.id});
  var acceleration = ref && ref.acceleration;
  if (!acceleration || acceleration.x === x && acceleration.y === y) return;
  acceleration.Set(x, y);
  acceleration.Normalize();
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

export var destroyObject = function (game, object) {
  var existing = findObject(game, object);
  if (!existing) return;
  require('shared/objects/' + object.type).destroy(existing);
  game.objects = _.without(game.objects, existing);
  return existing;
};

var handleCollision = function (game, a, b) {
  if (a.type === 'boost' && b.type === 'user') {
    Boost.fire(a, b);
    broadcastAll(game);
  } else if (a.type === 'bomb') {
    Bomb.explode(a);
    broadcastAll(game);
  }
};

export var addFrame = function (game, frame) {
  var jitter = frame.s - game.step;
  game.jitters = [jitter].concat(game.jitters).slice(0, JITTERS_TO_HOLD);
  if (jitter > 0) game.frames.push(frame);
};

export var create = function () {
  var game = {
    incr: 0,
    step: 0,
    start: Date.now(),
    jitters: [],
    frames: [],
    objects: [],
    world: new b2.b2World(),
    scene: config.node ? null : new THREE.Scene()
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
    {type: 'boost', x: 12, y: 10},
    {type: 'boost', x: 16, y: 6},
    {type: 'bomb', x: 10, y: 4},
    {type: 'bomb', x: 10, y: 8},
    {type: 'bomb', x: 14, y: 4},
    {type: 'bomb', x: 14, y: 8},
    {type: 'bomb', x: 5, y: 5}
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
  if (config.node) game.world.SetContactListener(listener);

  return game;
};

export var start = function (game) {
  step(game);
};

export var stop = function (game) {
  clearTimeout(game.stepTimeoutId);
};
