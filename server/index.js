var _ = require('underscore');

global.window = {};

var setExport = function (key) { exports[key] = require('./setup/' + key); };

_.each(['knex', 'express', 'ws', 'games'], setExport);

process.on('SIGTERM', _.bind(process.exit, process, 0));
