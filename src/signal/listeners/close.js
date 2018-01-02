const _ = require('underscore');
const {remove, trigger} = require('../utils/subs');
const sockets = require('../utils/sockets');

module.exports = ({socket}) => {
  remove(socket);
  if (socket.host) {
    delete sockets.hosts[socket.host.id];
    trigger('host-removed');
  } else if (socket.userId) {
    const {userId} = socket;
    const {users} = sockets;
    users[userId] = _.without(users[userId], socket);
    if (!users[userId].length) delete users[userId];
  }
  delete sockets.all[socket.id];
  console.log(`${socket.id} disconnected`);
};
