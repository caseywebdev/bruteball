const createUser = require('./create-user');
const findUser = require('./find-user');

module.exports = where =>
  findUser(where).then(user => user || createUser(where));
