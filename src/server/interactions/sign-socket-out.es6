import _ from 'underscore';
import app from 'index';
import * as Game from 'shared/objects/game';
import userPattern from 'patterns/games/show-user';

export default function (socket) {
  var user = socket.user;
  if (!user) return;
  if (!_.any(_.map(app.io.server.clients, 'user'), {id: user.id})) {
    var game = app.games.test;
    var obj = _.find(game.objects, {type: 'user', id: user.id});
    if (!obj) return;
    app.io.server.to('all').emit('remove-user', userPattern(obj));
    Game.destroyObject(game, obj);
  }
}
