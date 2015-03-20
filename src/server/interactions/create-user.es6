import {db} from 'setup/knex';
import {createRand} from 'entities/user';

export default function (cb) {
  db.insert({rand: createRand()})
    .into('users')
    .returning('*')
    .exec(function (er, users) {
      if (er) return cb(er);
      cb(null, users[0]);
    });
}
