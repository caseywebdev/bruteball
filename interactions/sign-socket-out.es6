import _ from 'underscore';
import app from 'index';
import Game from 'entities/game';

export default function (socket) {
  var user = socket.user;
  if (!user) return;
  if (!_.any(_.map(app.ws.server.clients, 'user'), {id: user.id})) {
    Game.removeUser(app.games.test, user);
  }
}
