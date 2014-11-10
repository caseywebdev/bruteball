import _ from 'underscore';
import app from 'index';
import async from 'async';
import createUser from 'interactions/create-user';
import Game from 'shared/objects/game';
import gamePattern from 'patterns/games/show';
import User from 'entities/user';
import usersShowPattern from 'patterns/users/show';

var db = app.knex.db;

export default function (socket, key, cb) {
  var done = function (er, user) {
    if (er) return cb(er);
    socket.user = user;
    Game.createObject(app.games.test, {type: 'user', id: user.id});
    cb(null, usersShowPattern(user, {withPrivate: true}));
    var game = app.games.test;
    socket.emit('new-game', gamePattern(game, {objects: game.objects}));
  };
  if (!key || !_.isString(key)) return createUser(done);
  async.waterfall([
    function (cb) {
      db.select()
        .from('users')
        .where({id: User.getIdFromKey(key), rand: User.getRandFromKey(key)})
        .limit(1)
        .exec(cb);
    },
    function (rows, cb) { rows.length ? cb(null, rows[0]) : createUser(cb); }
  ], done);
}
