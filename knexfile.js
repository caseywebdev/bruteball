var config = require('./build/node_modules/shared/config');

var knexConfig = {};
knexConfig[config.env] = config.knex;

module.exports = knexConfig;
