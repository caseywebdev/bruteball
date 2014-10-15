import _ from 'underscore';
import app from 'index';
import getListeners from 'interactions/get-listeners';
import signSocketOut from 'interactions/sign-socket-out';
import ws from 'ws';

export var server = new ws.Server({server: app.express.server});

var listeners = getListeners(__dirname + '/../listeners/ws');

server.broadcast = function (name, data) {
  _.invoke(server.clients, 'send', name, data);
};

server.on('connection', function (socket) {
  socket.callbacks = [];

  socket._send = socket.send;
  socket.send = function (name, data, cb) {
    if (!name || socket.readyState !== ws.OPEN) return;
    var id = _.uniqueId();
    var req = {id: id, name: name, data: data};
    socket.callbacks[id] = cb;
    socket._send(JSON.stringify(req));
  };

  socket.on('message', function (raw) {
    try { raw = JSON.parse(raw); } catch (er) { return socket.close(); }
    var id = raw.id;
    var cb = socket.callbacks[id];
    delete socket.callbacks[id];
    var name = raw.name;
    var listener = listeners[name];
    if (listener) {
      return listener(socket, raw.data, function (er, data) {
        if (socket.readyState !== ws.OPEN) return;
        var res = {id: id};
        if (er) res.error = er.toString();
        if (data) res.data = data;
        socket._send(JSON.stringify(res));
      });
    }
    if (cb) cb(raw.error && new Error(raw.error), raw.data);
  });

  socket.on('close', _.partial(signSocketOut, socket));
});
