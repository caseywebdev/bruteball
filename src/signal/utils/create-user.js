import _ from 'underscore';
import db from './db';
import uuid from 'node-uuid';

export default where =>
  db.insert(_.extend({}, where, {uuid: uuid.v4()}))
    .into('users')
    .returning('*')
    .then(_.first);
