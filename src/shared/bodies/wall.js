const _ = require('underscore');
const {Bodies, Vector, World} = require('matter-js');

module.exports = ({game, points, x, y}) => {
  const vertices = _.map(points, ({x, y}) => Vector.create(x, y));
  const body = Bodies.fromVertices(x, y, vertices);
  World.addBody(game.world, body);
  return body;
};
