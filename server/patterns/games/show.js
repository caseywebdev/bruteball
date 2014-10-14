var _ = require('underscore');
var dump = require('../../interactions/dump');

var dumpUser = _.partial(dump, 'games/users/show');

module.exports = function (game) {
  var obj = _.pick(game, 'id');
  obj.u = _.map(game.users, dumpUser);
  return obj;
};
