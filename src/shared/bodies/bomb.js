const {Circle, Vec2} = require('planck-js');
const config = require('../config');

const {bombRadius} = config.game;

const FIXTURE_DEF = {
  shape: new Circle(bombRadius),
  isSensor: true
};

export default ({game, x, y}) => {
  const body = game.world.createBody();
  body.setPosition(new Vec2(x, y));
  body.createFixture(FIXTURE_DEF);
  return body;
};
