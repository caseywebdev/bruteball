const {Circle, Vec2} = require('planck-js');
const config = require('../config');

const {hatRadius} = config.game;

const FIXTURE_DEF = {
  shape: new Circle(hatRadius),
  isSensor: true
};

module.exports = ({game, x, y}) => {
  const body = game.world.createBody();
  body.setPosition(new Vec2(x, y));
  body.createFixture(FIXTURE_DEF);
  return body;
};
