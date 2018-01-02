const _ = require('underscore');
const db = require('./db');

module.exports = where =>
  db('users').select('*').where(where).then(_.first);
