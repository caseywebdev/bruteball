const auth = require('../utils/auth');

module.exports = {
  'auth!.$obj':
  ({store: {state: {socket}}, 1: options}) =>
    auth(socket, options.token, options)
};
