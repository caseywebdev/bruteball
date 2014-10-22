import _ from 'underscore';
import gamesUsersShowPattern from 'patterns/games/users/show';

export default function (game, options) {
  var obj = _.pick(game, 'id');
  obj.t = game.time;
  var users = (options && options.users) || game.users;
  obj.u = _.map(users, gamesUsersShowPattern);
  return obj;
}
