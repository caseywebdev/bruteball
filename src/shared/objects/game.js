const _ = require('underscore');
const {World} = require('planck-js');
const Bomb = require('./bomb');
const Boost = require('./boost');
const config = require('../config');
const Hat = require('./hat');
const Wall = require('./wall');
const now = require('../utils/now');

const {fixedTimeStep, positionIterations, velocityIterations} = config.game;

var MAP_SIZE = 32;

const createMap = game => {
  _.each([{
    klass: Wall,
    x: 0,
    y: 0,
    points: [
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 1, y: MAP_SIZE},
      {x: 0, y: MAP_SIZE}
    ]
  }, {
    klass: Wall,
    x: MAP_SIZE - 1,
    y: 0,
    points: [
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 1, y: MAP_SIZE},
      {x: 0, y: MAP_SIZE}
    ]
  }, {
    klass: Wall,
    x: 1,
    y: 0,
    points: [
      {x: 0, y: 0},
      {x: MAP_SIZE - 2, y: 0},
      {x: MAP_SIZE - 2, y: 1},
      {x: 0, y: 1}
    ]
  }, {
    klass: Wall,
    x: 1,
    y: MAP_SIZE - 1,
    points: [
      {x: 0, y: 0},
      {x: MAP_SIZE - 2, y: 0},
      {x: MAP_SIZE - 2, y: 1},
      {x: 0, y: 1}
    ]
  },
    {klass: Wall, x: 4, y: 7},
    {klass: Wall, x: 5, y: 8, points: Wall.WITHOUT_BOTTOM_RIGHT},
    {klass: Wall, x: 4, y: 8, points: Wall.WITHOUT_TOP_LEFT},
    {klass: Wall, x: 5, y: 9, points: Wall.WITHOUT_TOP_LEFT},
    {klass: Wall, x: 6, y: 9},
    {klass: Wall, x: 8, y: 9, points: Wall.WITHOUT_BOTTOM_RIGHT},
    {klass: Wall, x: 7, y: 9},
    {klass: Wall, x: 6, y: 7, points: Wall.WITHOUT_TOP_LEFT},
    {klass: Wall, x: 7, y: 7},
    {klass: Wall, x: 8, y: 7, points: Wall.WITHOUT_TOP_RIGHT},
    {klass: Wall, x: 4, y: 6},
    {klass: Wall, x: 4, y: 5},
    {klass: Wall, x: 6, y: 6},
    {klass: Wall, x: 6, y: 5},
    {klass: Wall, x: 4, y: 3, points: Wall.WITHOUT_BOTTOM_RIGHT},
    {klass: Wall, x: 4, y: 4},
    {klass: Wall, x: 6, y: 4},
    {klass: Wall, x: 6, y: 3, points: Wall.WITHOUT_BOTTOM_LEFT},
    {klass: Boost, x: 12.5, y: 10.5},
    {klass: Boost, x: 16.5, y: 6.5},
    {klass: Bomb, x: 10.5, y: 4.5},
    {klass: Bomb, x: 10.5, y: 8.5},
    {klass: Bomb, x: 14.5, y: 4.5},
    {klass: Bomb, x: 14.5, y: 8.5},
    {klass: Boost, x: 5.5, y: 5.5},
    {klass: Hat, x: 20.5, y: 20.5}
  ], ({klass, ...options}) => game.createObject(klass, options));
};

module.exports = class {
  stepCount = 0;
  time = 0;
  idCounter = 0;
  objects = [];
  world = new World();

  constructor() {
    this.createScene();
    createMap(this);
    this.world.on('begin-contact', ({m_fixtureA: a, m_fixtureB: b}) => {
      a = _.find(this.objects, {body: a.m_body});
      b = _.find(this.objects, {body: b.m_body});
      if (a.handleContact) a.handleContact(b);
      if (b.handleContact) b.handleContact(a);
    });
    this.start();
  }

  createScene() {}

  start() {
    this.startedAt = now() - (this.stepCount * fixedTimeStep);
    this.step();
  }

  stop() {
    clearImmediate(this.stepImmediateId);
  }

  step = () => {
    const lastStepTime = this.startedAt + (fixedTimeStep * this.stepCount);
    if (now() - lastStepTime < fixedTimeStep) {
      return this.stepImmediateId = setImmediate(this.step);
    }

    ++this.stepCount;
    this.world.publish('pre-step');
    this.world.step(fixedTimeStep, velocityIterations, positionIterations);
    this.world.publish('post-step');
    this.step();
  }

  createObject(klass, options) {
    let {id} = options;
    if (id) {
      const object = _.find(this.objects, {id});
      if (object) return object;
    } else {
      id = ++this.idCounter;
    }
    const object = new klass({...options, game: this, id});
    this.objects.push(object);
    return object;
  }

  destroyObject({id}) {
    const object = _.find(this.objects, {id});
    if (!object) return;

    object.destroy();
    this.objects = _.without(this.objects, object);
    return object;
  }
};
