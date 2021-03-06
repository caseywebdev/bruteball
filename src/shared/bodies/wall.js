const _ = require('underscore');
const {Polygon, Vec2} = require('planck-js');

const FIXTURE_DEF = {
  friction: 0,
  restitution: 0.2
};

module.exports = ({game, points, x, y}) => {
  const shape = new Polygon(_.map(points, ({x, y}) => new Vec2(x, y)));
  const body = game.world.createBody();
  body.setPosition(new Vec2(x, y));
  body.createFixture(shape, FIXTURE_DEF);
  return body;
};
