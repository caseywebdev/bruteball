var config = require('./build/node_modules/config');

var knexConfig = {};
knexConfig[config.env] = config.knex;

module.exports = knexConfig;
