import app from 'index';
import Game from 'shared/objects/game';

export default function (socket, av, cb) {
  var ax = parseInt(av[0]);
  var ay = parseInt(av[1]);
  if (!socket.user || isNaN(ax) || isNaN(ay)) return cb();
  var game = app.games.test;
  Game.setAcceleration(game, socket.user, ax, ay);
  cb();
}
