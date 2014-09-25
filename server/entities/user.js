var _ = require('underscore');

var all = exports.all = {};

exports.add = function (user) {
  return all[user.id] = _.extend(all[user.id] || {}, user);
};

exports.remove = function (user) {
  delete all[user.id];
};

exports.findById = function (id) {
  return _.find(all, {id: id});
};
