import _ from 'underscore';
import * as io from 'setup/io';
import games from 'setup/games';
import * as Game from 'shared/objects/game';
import userPattern from 'patterns/games/show-user';

export default function (socket) {
  var user = socket.user;
  if (!user) return;
  if (!_.any(_.map(io.server.clients, 'user'), {id: user.id})) {
    var game = games.test;
    var obj = _.find(game.objects, {type: 'user', id: user.id});
    if (!obj) return;
    io.server.to('all').emit('remove-user', userPattern(obj));
    Game.destroyObject(game, obj);
  }
}
