import games from 'setup/games';
import * as Game from 'shared/objects/game';

export default function (socket, av, cb) {
  var ax = parseInt(av[0]);
  var ay = parseInt(av[1]);
  if (!socket.user || isNaN(ax) || isNaN(ay)) return cb();
  var game = games.test;
  Game.setAcceleration(game, socket.user, ax, ay);
  cb();
}
