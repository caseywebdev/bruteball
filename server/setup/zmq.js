var config = require('../config');
var getListeners = require('../interactions/get-listeners');
var zmq = require('zmq');

var push = zmq.socket('push');
push.bindSync(config.zmq);

var pull = zmq.socket('pull');
pull.connect(config.zmq);

var listeners = getListeners(__dirname + '/../listeners/zmq');

pull.on('message', function (raw) {
  var parsed = JSON.parse(raw.toString());
  var cb = listeners[parsed.name];
  if (cb) cb(parsed.data);
});

exports.send = function (name, data) {
  push.send(JSON.stringify({name: name, data: data}));
};
