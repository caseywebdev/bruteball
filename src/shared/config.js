const _ = require('underscore');
const {Vec2} = require('planck-js');
const Qs = require('qs');

const {env} = typeof window === 'undefined' ? process : window;

module.exports = {
  game: {
    accelerationScalar: 5,
    ballRadius: 0.49,
    bombRadius: 0.4,
    bombWait: 500,
    boostRadius: 0.5,
    boostWait: 500,
    fixedTimeStep: 1 / 60,
    hatRadius: 0.375,
    hiddenPosition: new Vec2(-1, -1),
    linearDamping: 0.5,
    maxSpeed: 7.5,
    positionIterations: 10,
    stepsPerBroadcast: 15,
    velocityIterations: 8
  },
  errors: {
    authRequired: new Error('Authentication required'),
    invalidKey: new Error('Invalid or expired key'),
    unknown: new Error('An unknown error occurred')
  },
  client: {
    url: env.CLIENT_URL
  },
  regions: _.map(Qs.parse(env.REGIONS), (url, id) => ({id, url})),
  signal: {
    url: env.SIGNAL_URL
  },
  version: env.VERSION
};
