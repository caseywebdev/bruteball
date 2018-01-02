const _ = require('underscore');
const sockets = require('../utils/sockets');

module.exports = () => _.compact(_.map(sockets.all, 'host'));
