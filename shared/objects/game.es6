import _ from 'underscore';
import average from 'shared/utils/average';
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
var STEP_DELTAS_TO_HOLD = 10;
var VI = config.game.velocityIterations;

var broadcast = function (game) {
  if (config.node && game.changed.length) {
    app.io.server.to('all').emit('g', gamePattern(game));
  }
  game.changed = [];
};

var invoke = function (game, key) {
  _.each(game.objects, function (object) {
    var Type = require('shared/objects/' + object.type);
    if (Type[key]) Type[key](object);
  });
};

export var applyFrame = function (game, g) {
  _.each(g.o, function (objects, type) {
    var Type = require('shared/objects/' + type);
    _.each(objects, _.partial(Type.applyFrame, game, _, g.s));
  });
};

var needsFrame = function (game) {
  var frames = game.frames;
  return !!frames.length && game.step >= frames[0].s;
};

export var getJitter = function (game) {
  return Math.ceil(2 * stdDev(game.stepDeltas));
};

var needsCatchup = function (game) {
  var frames = game.frames;
  return !!frames.length && game.step < _.last(frames).s - getJitter(game);
};

var needsWait = function (game) {
  return average(game.stepDeltas) < 0;
};

export var step = function (game) {
  if (config.node) {
    game.stepTimeoutId = _.defer(_.partial(step, game));
    if ((Date.now() - game.start) / DT_MS < game.step) return;
  } else if (needsWait(game)) return;
  if (game.step % STEPS_PER_BROADCAST === 0) {
    game.changed = game.changed.concat(_.filter(game.objects, {type: 'user'}));
  }
  broadcast(game);
  while (needsFrame(game)) applyFrame(game, game.frames.shift());
  ++game.step;
  invoke(game, 'preStep');
  game.world.Step(DT, VI, PI);
  invoke(game, 'postStep');
  if (needsCatchup(game)) step(game);
};

export var findObject = function (game, object) {
  return _.find(game.objects, _.pick(object, 'type', 'id'));
};

export var setAcceleration = function (game, user, x, y) {
  var ref = findObject(game, {type: 'user', id: user.id});
  var acceleration = ref && ref.acceleration;
  if (!acceleration || acceleration.x === x && acceleration.y === y) return;
  acceleration.Set(x, y);
  acceleration.Normalize();
  game.changed.push(ref);
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
  if (a.type === 'boost' && b.type === 'user') Boost.use(a, b);
  else if (a.type === 'bomb') Bomb.use(a);
};

export var addFrame = function (game, frame) {
  var stepDelta = frame.s - game.step;
  game.stepDeltas =
    [stepDelta].concat(game.stepDeltas).slice(0, STEP_DELTAS_TO_HOLD);
  game.frames.push(frame);
};

export var create = function () {
  var game = {
    incr: 0,
    step: 0,
    start: Date.now(),
    stepDeltas: [],
    frames: [],
    objects: [],
    changed: [],
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
    {type: 'wall', x: 4, y: 7},
    {type: 'wall', x: 5, y: 8, points: Wall.WITHOUT_BOTTOM_RIGHT},
    {type: 'wall', x: 4, y: 8, points: Wall.WITHOUT_TOP_LEFT},
    {type: 'wall', x: 5, y: 9, points: Wall.WITHOUT_TOP_LEFT},
    {type: 'wall', x: 6, y: 9},
    {type: 'wall', x: 8, y: 9, points: Wall.WITHOUT_BOTTOM_RIGHT},
    {type: 'wall', x: 7, y: 9},
    {type: 'wall', x: 6, y: 7, points: Wall.WITHOUT_TOP_LEFT},
    {type: 'wall', x: 7, y: 7},
    {type: 'wall', x: 8, y: 7, points: Wall.WITHOUT_TOP_RIGHT},
    {type: 'wall', x: 4, y: 6},
    {type: 'wall', x: 4, y: 5},
    {type: 'wall', x: 6, y: 6},
    {type: 'wall', x: 6, y: 5},
    {type: 'wall', x: 4, y: 3, points: Wall.WITHOUT_BOTTOM_RIGHT},
    {type: 'wall', x: 4, y: 4},
    {type: 'wall', x: 6, y: 4},
    {type: 'wall', x: 6, y: 3, points: Wall.WITHOUT_BOTTOM_LEFT},
    {type: 'boost', x: 12, y: 10},
    {type: 'boost', x: 16, y: 6},
    {type: 'bomb', x: 10, y: 4},
    {type: 'bomb', x: 10, y: 8},
    {type: 'bomb', x: 14, y: 4},
    {type: 'bomb', x: 14, y: 8},
    {type: 'boost', x: 5, y: 5}
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
