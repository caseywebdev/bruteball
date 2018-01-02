const {Bodies, World} = require('matter-js');
const config = require('../config');

const {hatRadius} = config.game;

module.exports = ({game, x, y}) => {
  const body = Bodies.circle(x, y, hatRadius, {isSensor: true});
  World.addBody(game.world, body);
  return body;
};
