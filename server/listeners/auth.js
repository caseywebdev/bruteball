var _ = require('underscore');
var async = require('async');
var broadcastUsers = require('../interactions/broadcast-users');
var OrgSyncApi = require('orgsync-api');
var User = require('../entities/user');

module.exports = function (socket, key, cb) {
  var api = new OrgSyncApi({key: key});
  async.waterfall([
    async.apply(_.bind(api.get, api), '/accounts/me'),
    function (res, cb) {
      socket.user = User.add(res.data);
      broadcastUsers();
      cb(null, res.data);
    }
  ], cb);
};
