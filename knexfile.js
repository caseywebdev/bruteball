var config = require('./server/config');

var knexConfig = {};
knexConfig[config.env] = config.knex;

module.exports = knexConfig;
