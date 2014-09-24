var _ = require('underscore');
var broadcastUsers = require('../interactions/broadcast-users');
var app = require('..');
var fs = require('fs');
var path = require('path');
var ws = require('ws');
var wss = exports.server = new ws.Server({server: app.express.server});

var ANONYMOUS_USER = exports.ANONYMOUS_USER = {
  id: 1,
  display_name: 'Anonymous'
};

var listeners = _.reduce(
  fs.readdirSync(__dirname + '/../listeners'),
  function (listeners, file) {
    if (file[0] !== '.') {
      var basename = path.basename(file, path.extname(file));
      listeners[basename] = require('../listeners/' + file);
    }
    return listeners;
  },
  {}
);

wss.on('connection', function (client) {
  client.callbacks = [];
  client.user = ANONYMOUS_USER;

  var _send = _.bind(client.send, client);
  client.send = function (name, data, cb) {
    if (!name) return;
    var id = _.uniqueId();
    var req = {id: id, name: name, data: data};
    client.callbacks[id] = cb;
    _send(JSON.stringify(req));
  };

  client.on('message', function (raw) {
    try { raw = JSON.parse(raw); } catch (er) { return client.close(); }
    var id = raw.id;
    var cb = client.callbacks[id];
    delete client.callbacks[id];
    var name = raw.name;
    var listener = listeners[name];
    if (listener) {
      return listener(client, raw.data, function (er, data) {
        var res = {id: id};
        if (er) res.error = er.toString();
        if (data) res.data = data;
        _send(JSON.stringify(res));
      });
    }
    if (cb) cb(raw.error && new Error(raw.error), raw.data);
  });

  client.on('close', broadcastUsers);

  broadcastUsers();
});
