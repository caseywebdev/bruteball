const {Bodies, World} = require('matter-js');
const config = require('../config');

const {ballRadius} = config.game;

module.exports = ({game, x, y}) => {
  const body = Bodies.circle(x, y, ballRadius, {inertia: Infinity});
  World.addBody(game.world, body);
  return body;
};
