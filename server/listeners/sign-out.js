var app = require('..');
var broadcastUsers = require('../interactions/broadcast-users');

module.exports = function (socket, key, cb) {
  socket.api = null;
  socket.user = app.ws.ANONYMOUS_USER;
  broadcastUsers();
  cb(null);
};
