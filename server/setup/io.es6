import _ from 'underscore';
import app from 'index';
import getListeners from 'interactions/get-listeners';
import io from 'socket.io';

var listeners = getListeners(__dirname + '/../listeners/io');

export var server = io(app.express.server);

server.sockets.on('connection', function (socket) {
  socket.join('game');
  _.each(listeners, function (listener, name) {
    socket.on(name, function (data, cb) {
      listener(socket, data, cb || _.noop);
    });
  });
});
