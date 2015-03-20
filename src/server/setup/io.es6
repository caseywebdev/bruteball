import _ from 'underscore';
import {server as expressServer} from 'setup/express';
import getListeners from 'interactions/get-listeners';
import io from 'socket.io';

var listeners = getListeners(__dirname + '/../listeners/io');

export var server = io(expressServer);

server.on('connection', function (socket) {
  socket.join('all');
  _.each(listeners, function (listener, name) {
    socket.on(name, function (data, cb) {
      listener(socket, data, cb || _.noop);
    });
  });
});
