import _ from 'underscore';
import gamesUsersShowPattern from 'patterns/games/users/show';

export default function (game) {
  var obj = _.pick(game, 'id');
  obj.u = _.map(game.users, gamesUsersShowPattern);
  return obj;
}
