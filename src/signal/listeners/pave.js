const {Store} = require('pave');
const auth = require('../utils/auth');
const Promise = require('better-promise');
const config = require('../config');
const router = require('../routes');

const {invalidKey} = config.errors;

const tryAuth = (socket, authToken) =>
  Promise
    .resolve()
    .then(() => authToken && auth(socket, authToken))
    .catch(er => {
      if (er === invalidKey) return {authToken: {$set: null}};
      throw er;
    });

module.exports = ({socket, params: {query, authToken}}) =>
  tryAuth(socket, authToken).then(authTokenDelta =>
    (new Store({state: {socket}, router})).run({query}).then(delta =>
      authTokenDelta ? [authTokenDelta, delta] : delta
    )
  );
