const auth = require('../utils/auth');
const config = require('../config');
const findOrCreateUser = require('../utils/find-or-create-user');
const sockets = require('../utils/sockets');
const sign = require('../../shared/utils/sign');
const updateSignedInAt = require('../utils/update-signed-in-at');
const verify = require('../../shared/utils/verify');

const {key, errors: {invalidKey}, verifyKeyMaxAge} = config;

const checkSignedInAt = (data, {id, signedInAt, expiredTokensAt}) => {
  if (signedInAt) signedInAt = signedInAt.toISOString();
  if (signedInAt !== data.signedInAt) throw invalidKey;

  if (expiredTokensAt && data.iat * 1000 < expiredTokensAt) throw invalidKey;

  return updateSignedInAt(id);
};

const createAuthToken = (socket, data, user) => {
  const {id: userId} = user;
  const token = sign(key, 'auth', {userId});
  const origin = sockets.all[data.socketId];
  const delta = {
    authToken: {$set: token},
    user: {$set: {$ref: ['usersById', userId]}}
  };
  if (origin && origin !== socket) {
    auth(origin, token);
    origin.send('pave', delta);
  }
  return auth(socket, token).then(() => delta);
};

module.exports = {
  'verify!.$obj':
  ({store: {state: {socket}}, 1: {token}}) => {
    const data = verify(key, 'verify', token, verifyKeyMaxAge);
    if (!data) throw invalidKey;

    const {emailAddress} = data;
    return findOrCreateUser({emailAddress})
      .then(user => checkSignedInAt(data, user))
      .then(user => createAuthToken(socket, data, user));
  }
};
