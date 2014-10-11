var config = require('../config');
var knex = require('knex');

var logQuery = function (query) { console.log(query.sql); };

exports.db = knex(config.knex).on('query', logQuery);
