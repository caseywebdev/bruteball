const _ = require('underscore');
const config = require('../config');
const findUser = require('../utils/find-user');
const sign = require('../../shared/utils/sign');
const signIn = require('../templates/sign-in');
const mail = require('../utils/mail');

const {key} = config;

module.exports = {
  'signIn!.$obj':
  ({store: {state: {socket}}, 1: {emailAddress}}) =>
    findUser({emailAddress}).then(({signedInAt = null} = {}) =>
      mail({
        to: emailAddress,
        subject: 'Sign in to Bruteball',
        markdown: signIn({
          token: sign(key, 'verify', {
            emailAddress,
            signedInAt,
            socketId: socket.id
          })
        })
      })
    ).then(_.noop)
};
