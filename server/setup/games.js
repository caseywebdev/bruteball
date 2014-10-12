var Game = require('../entities/game');
var User = require('../entities/user');

Game.create(User.all);
