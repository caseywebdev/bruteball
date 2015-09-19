import _ from 'underscore';
import {db} from 'setup/knex';
import games from 'setup/games';
import async from 'async';
import createUser from 'interactions/create-user';
import * as Game from 'shared/objects/game';
import gamePattern from 'patterns/games/show';
import * as User from 'entities/user';
import usersShowPattern from 'patterns/users/show';

export default function (socket, key, cb) {
  var done = function (er, user) {
    if (er) return cb(er);
    socket.user = user;
    Game.createObject(games.test, {type: 'user', id: user.id});
    cb(null, usersShowPattern(user, {withPrivate: true}));
    var game = games.test;
    socket.emit('new-game', gamePattern(game, {objects: game.objects}));
  };
  if (!key || !_.isString(key)) return createUser(done);
  async.waterfall([
    function (cb) {
      db.select()
        .from('users')
        .where({id: User.getIdFromKey(key), rand: User.getRandFromKey(key)})
        .limit(1)
        .asCallback(cb);
    },
    function (rows, cb) { rows.length ? cb(null, rows[0]) : createUser(cb); }
  ], done);
}
