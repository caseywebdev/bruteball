var _ = require('underscore');
var app = require('..');
var dump = require('./dump');
var User = require('../entities/user');

module.exports = function () {
  var users = _.map(User.all, _.partial(dump, 'users/show'));
  app.zmq.send('broadcast', {name: 'users', data: users});
};
