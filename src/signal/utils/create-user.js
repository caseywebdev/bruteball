const _ = require('underscore');
const db = require('./db');
const uuid = require('uuid/v4');

module.exports = where =>
  db.insert(_.extend({}, where, {id: uuid()}))
    .into('users')
    .returning('*')
    .then(_.first);
