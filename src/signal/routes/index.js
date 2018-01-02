const {Router} = require('pave');
const auth = require('./auth');
const expireTokens = require('./expire-tokens');
const notFound = require('./not-found');
const signIn = require('./sign-in');
const user = require('./user');
const usersById = require('./users-by-id');
const verify = require('./verify');

module.exports = new Router({
  maxQueryCost: 10000,
  routes: {
    ...auth,
    ...expireTokens,
    ...notFound,
    ...signIn,
    ...user,
    ...usersById,
    ...verify
  }
});
