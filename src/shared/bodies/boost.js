const {Bodies, World} = require('matter-js');
const config = require('../config');

const {boostRadius} = config.game;

module.exports = ({game, x, y}) => {
  const body = Bodies.circle(x, y, boostRadius, {isSensor: true});
  World.addBody(game.world, body);
  return body;
};
