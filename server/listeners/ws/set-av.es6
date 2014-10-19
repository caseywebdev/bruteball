import app from 'index';
import Game from 'shared/entities/game';

export default function (socket, av, cb) {
  var ax = parseInt(av.x);
  var ay = parseInt(av.y);
  if (!socket.user || isNaN(ax) || isNaN(ay)) return cb();
  var game = app.games.test;
  Game.setAcceleration(game, socket.user, ax, ay);
  cb();
}
