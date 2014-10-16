import app from 'index';
import config from 'config';
import Game from 'entities/game';
import gamePattern from 'patterns/games/show';

export var test = Game.create();

var broadcast = function () {
  app.ws.server.broadcast('g', gamePattern(test));
  setTimeout(broadcast, 1000 / config.game.broadcastsPerSecond);
};

broadcast();
