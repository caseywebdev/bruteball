const _ = require('underscore');
const db = require('./db');

module.exports = id =>
  db('users')
    .where({id})
    .update({signedInAt: new Date()})
    .returning('*')
    .then(_.first);
