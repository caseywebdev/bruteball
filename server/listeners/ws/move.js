var _ = require('underscore');

var DIRS = ['up' ,'down' ,'left' ,'right'];

module.exports = function (socket, move, cb) {
  if (!socket.user || !_.contains(DIRS, move.dir)) return cb();
  socket.user[move.dir] = move.state;
  cb();
};
