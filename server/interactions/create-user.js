var app = require('..');
var User = require('../entities/user');

var db = app.knex.db;

module.exports = function (cb) {
  db.insert({rand: User.createRand()})
    .into('users')
    .returning('*')
    .exec(function (er, users) {
      if (er) return cb(er);
      cb(null, users[0]);
    });
};
