var _ = require('underscore');
var app = require('../..');
var async = require('async');
var createUser = require('../../interactions/create-user');
var dump = require('../../interactions/dump');
var Game = require('../../entities/game');
var User = require('../../entities/user');

var db = app.knex.db;

module.exports = function (socket, key, cb) {
  var done = function (er, user) {
    if (er) return cb(er);
    socket.user = user;
    Game.addUser(app.games.test, user);
    cb(null, dump('users/show', user, {withPrivate: true}));
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
};
