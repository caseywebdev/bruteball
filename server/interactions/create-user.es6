import app from 'index';
import User from 'shared/entities/user';

var db = app.knex.db;

export default function (cb) {
  db.insert({rand: User.createRand()})
    .into('users')
    .returning('*')
    .exec(function (er, users) {
      if (er) return cb(er);
      cb(null, users[0]);
    });
}
