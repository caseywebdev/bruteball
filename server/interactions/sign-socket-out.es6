import _ from 'underscore';
import app from 'index';
import Game from 'shared/objects/game';
import userPattern from 'patterns/games/users/show';

export default function (socket) {
  var user = socket.user;
  if (!user) return;
  if (!_.any(_.map(app.io.server.clients, 'user'), {id: user.id})) {
    var game = app.games.test;
    var obj = Game.findObject(game, {type: 'user', id: user.id});
    if (!obj) return;
    app.io.server.to('game').emit('remove-user', userPattern(obj));
    Game.destroyObject(game, obj);
  }
}
