const _ = require('underscore');
const config = require('../../shared/config');
const db = require('../utils/db');
const sockets = require('../utils/sockets');

const {errors: {authRequired}} = config;

module.exports = {
  'expireTokens!':
  ({store: {state: {socket: {userId: id}}}}) => {
    if (!id) throw authRequired;

    return db('users')
      .where({id: id})
      .update({expiredTokensAt: new Date()})
      .then(() => {
        _.each([].concat(
          sockets.users[id],
          _.filter(sockets.hosts, ({host: {userId}}) => userId === id)
        ), socket => {
          socket.send('pave', {authToken: {$set: null}, user: {$set: null}});
          socket.close();
        });
      });
  }
};
