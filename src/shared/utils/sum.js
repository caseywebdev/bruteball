const _ = require('underscore');

module.exports = ns => _.reduce(ns, (sum, n) => sum + n, 0);
