const sockets = require('../utils/sockets');
const uuid = require('uuid/v4');

module.exports = ({socket}) => {
  sockets.all[socket.id = uuid()] = socket;
  console.log(`${socket.id} connected`);
};
