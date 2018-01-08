const {Bodies, World} = require('matter-js');

module.exports = ({game, points, x, y}) => {
  const body = Bodies.fromVertices(x, y, points, {isStatic: true});
  World.addBody(game.world, body);
  return body;
};
