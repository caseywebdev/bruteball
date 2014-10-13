var _ = require('underscore');

module.exports = function (game) {
  var obj = _.pick(game, 'id');
  obj.u = _.map(game.users, function (user) {
    return {
      id: user.info.id,
      x: user.ball.position[0],
      y: user.ball.position[1],
      vx: user.ball.velocity[0],
      vy: user.ball.velocity[1]
    };
  });
  return obj;
};
