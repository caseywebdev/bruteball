import _ from 'underscore';
import app from 'index';
import async from 'async';
import createUser from 'interactions/create-user';
import Game from 'entities/game';
import User from 'entities/user';
import usersShowPattern from 'patterns/users/show';

var db = app.knex.db;

export default function (socket, key, cb) {
  var done = function (er, user) {
    if (er) return cb(er);
    socket.user = user;
    Game.addUser(app.games.test, user);
    cb(null, usersShowPattern(user, {withPrivate: true}));
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
