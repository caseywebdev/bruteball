var _ = require('underscore');
var app = require('..');
var ws = require('ws');

module.exports = function (name, data) {
  var clients = _.filter(app.ws.server.clients, {readyState: ws.OPEN});
  _.invoke(clients, 'send', name, data);
};
