import _ from 'underscore';
import app from 'index';
import getListeners from 'interactions/get-listeners';
import liveServerBindings from 'live-server-bindings';
import signSocketOut from 'interactions/sign-socket-out';
import ws from 'ws';

export var server = new ws.Server({server: app.express.server});

var listeners = getListeners(__dirname + '/../listeners/ws');

liveServerBindings.ws(server, listeners);

server.broadcast = function (name, data) {
  _.invoke(server.clients, 'send', name, data);
};

server.on('connection', function (socket) {
  socket.on('close', _.partial(signSocketOut, socket));
});
