var signSocketOut = require('../interactions/sign-socket-out');

module.exports = function (socket, data, cb) {
  signSocketOut(socket);
  cb(null);
};
