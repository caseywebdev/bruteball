var _ = require('underscore');
var User = require('../../entities/user');

module.exports = function (user, options) {
  var obj = _.pick(user, 'id', 'x', 'y', 'dx', 'dy');
  obj.name = User.getName(user);
  obj.avatar_url = User.getAvatarUrl(user);
  if (options.withPrivate) {
    obj.email = user.email;
    obj.key = User.getKey(user);
  }
  return obj;
};
