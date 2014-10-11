var app = require('../..');

module.exports = function (data) {
  app.ws.server.broadcast(data.name, data.data);
};
