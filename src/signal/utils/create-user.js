const _ = require('underscore');
const db = require('./db');
const uuid = require('node-uuid');

module.exports = where =>
  db.insert(_.extend({}, where, {id: uuid.v4()}))
    .into('users')
    .returning('*')
    .then(_.first);
