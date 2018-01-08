const {Circle, Vec2} = require('planck-js');
const config = require('../config');

const {ballRadius, linearDamping} = config.game;

const BODY_DEF = {
  type: 'dynamic',
  fixedRotation: true,
  linearDamping
};

const FIXTURE_DEF = {
  shape: new Circle(ballRadius),
  density: 1,
  restitution: 0.2,
  friction: 0
};

module.exports = ({game, x, y}) => {
  const body = game.world.createBody(BODY_DEF);
  body.setPosition(new Vec2(x, y));
  body.createFixture(FIXTURE_DEF);
  return body;
};
