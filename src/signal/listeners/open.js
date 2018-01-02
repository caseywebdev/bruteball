const sockets = require('../utils/sockets');
const uuid = require('node-uuid');

module.exports = ({socket}) => {
  sockets.all[socket.id = uuid.v4()] = socket;
  console.log(`${socket.id} connected`);
};
