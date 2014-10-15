var config = require('./build/node_modules/config').default;

var knexConfig = {};
knexConfig[config.env] = config.knex;

module.exports = knexConfig;
