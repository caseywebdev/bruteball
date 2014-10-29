import _ from 'underscore';
import gamesUsersShowPattern from 'patterns/games/users/show';

export default function (game, options) {
  var obj = _.pick(game, 'id');
  obj.t = Date.now();
  var users = (options && options.users) ||
    _.filter(game.objects, {type: 'user'});
  obj.u = _.map(users, gamesUsersShowPattern);
  return obj;
}
