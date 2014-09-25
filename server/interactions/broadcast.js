var _ = require('underscore');
var app = require('..');

module.exports = function (name, data) {
  _.invoke(app.ws.server.clients, 'send', name, data);
};
