import config from 'config';
import knex from 'knex';

var logQuery = function (query) { console.log(query.sql); };

export var db = knex(config.knex).on('query', logQuery);
