import app from 'index';
import Game from 'entities/game';
import userPattern from 'patterns/games/users/show';

export default function (socket, av, cb) {
  var ax = parseInt(av.x);
  var ay = parseInt(av.y);
  if (!socket.user || isNaN(ax) || isNaN(ay)) return cb();
  var game = app.games.test;
  Game.setAcceleration(game, socket.user, ax, ay);
  app.ws.server.broadcast('u', userPattern(game.users[socket.user.id]));
  cb();
}
