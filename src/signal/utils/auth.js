const authHost = require('./auth-host');
const authUser = require('./auth-user');
const config = require('../config');
const db = require('./db');
const verify = require('../../shared/utils/verify');

const {key, errors: {invalidKey}} = config;

module.exports = (socket, token, {host: {name} = {}} = {}) => {
  if (socket.userId || socket.host) return Promise.resolve();

  const data = verify(key, 'auth', token);
  if (!data) throw invalidKey;

  const {userId} = data;
  return db('users').select('*').where({id: userId}).then(([user]) => {
    if (!user) throw invalidKey;

    const {expiredTokensAt} = user;
    if (expiredTokensAt && data.iat * 1000 < expiredTokensAt) {
      throw invalidKey;
    }

    if (name) return authHost(socket, userId, name, token);

    return authUser(socket, userId);
  });
};
