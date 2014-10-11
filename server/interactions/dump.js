module.exports = function (pattern, obj, options) {
  return require('../patterns/' + pattern)(obj, options || {});
};
