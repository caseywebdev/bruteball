import _ from 'underscore';
import app from 'index';
import Game from 'shared/entities/game';
import userPattern from 'patterns/games/users/show';

export default function (socket) {
  var user = socket.user;
  if (!user) return;
  if (!_.any(_.map(app.ws.server.clients, 'user'), {id: user.id})) {
    var game = app.games.test;
    app.ws.server.broadcast('remove-user', userPattern(game.users[user.id]));
    Game.removeUser(game, user);
  }
}
