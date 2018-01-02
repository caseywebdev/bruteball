const variance = require('shared/utils/variance');

module.exports = function (ns) {
  return Math.sqrt(variance(ns));
}
