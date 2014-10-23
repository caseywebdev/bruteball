import _ from 'underscore';
import Game from 'shared/entities/game';
import gamesUsersShowPattern from 'patterns/games/users/show';

export default function (game, options) {
  var obj = _.pick(game, 'id');
  obj.t = Game.getTime(game);
  var users = (options && options.users) || game.users;
  obj.u = _.map(users, gamesUsersShowPattern);
  return obj;
}
