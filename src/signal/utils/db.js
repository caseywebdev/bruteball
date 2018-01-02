const config = require('../config');
const knex = require('knex');

module.exports = knex(config.knex)
  .on('query', ({sql, bindings}) =>
    console.log(`SQL ${sql}${bindings ? ` : ${JSON.stringify(bindings)}` : ''}`)
  );
