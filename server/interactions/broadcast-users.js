var _ = require('underscore');
var app = require('..');
var broadcast = require('./broadcast');

module.exports = function () {
  broadcast('users', _.pluck(app.ws.server.clients, 'user'));
};
