var config = require('./build/node_modules/shared/config');

var knexConfig = {};
knexConfig[process.env.NODE_ENV || 'development'] = config.knex;

module.exports = knexConfig;
