var _ = require('underscore');

var setExport = function (key) { exports[key] = require('./setup/' + key); };

_.each(['zmq', 'knex', 'express', 'ws'], setExport);

process.on('SIGTERM', _.bind(process.exit, process, 0));
