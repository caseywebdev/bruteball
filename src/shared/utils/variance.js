const _ = require('underscore');
const average = require('shared/utils/average');

module.exports = function (ns) {
  var mean = average(ns);
  return average(_.map(ns, function (n) { return Math.pow(mean - n, 2); }));
}
