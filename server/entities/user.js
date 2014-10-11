var _ = require('underscore');
var crypto = require('crypto');

var KEY_DELIM = '-';

var DEFAULT_MD5 = 'e916863a6d94694aee15adb363333feb';

var GRAVATAR = function (md5) {
  return 'http://www.gravatar.com/avatar/' + md5 + '.png';
};

var DEFAULT_AVATAR_URL = GRAVATAR(DEFAULT_MD5);

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

exports.getKey = function (user) {
  return user.id + KEY_DELIM + user.rand;
};

exports.getIdFromKey = function (key) {
  return parseInt(key.split(KEY_DELIM)[0]);
};

exports.getRandFromKey = function (key) {
  return key.split(KEY_DELIM)[1];
};

exports.createRand = function () {
  return crypto.randomBytes(32).toString('hex');
};

exports.getName = function (user) {
  return user.name ? user.name : 'Bruteball ' + user.id;
};

exports.getAvatarUrl = function (user) {
  if (!user.email) return DEFAULT_AVATAR_URL;
  var hash = crypto.createHash('md5');
  hash.update(user.email);
  return GRAVATAR(hash.digest('hex'));
};
