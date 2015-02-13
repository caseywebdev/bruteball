import app from 'index';
import {createRand} from 'entities/user';

var db = app.knex.db;

export default function (cb) {
  db.insert({rand: createRand()})
    .into('users')
    .returning('*')
    .exec(function (er, users) {
      if (er) return cb(er);
      cb(null, users[0]);
    });
}
