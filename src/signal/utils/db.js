import config from '../config';
import knex from 'knex';

export default knex(config.knex)
  .on('query', ({sql, bindings}) =>
    console.log(`SQL ${sql}${bindings ? ` : ${JSON.stringify(bindings)}` : ''}`)
  );
