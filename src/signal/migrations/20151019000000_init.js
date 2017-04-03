export const up = ({schema}) =>
  schema
    .raw('CREATE EXTENSION IF NOT EXISTS citext')
    .createTable('users', t => {
      t.increments();
      t.specificType('emailAddress', 'citext').unique().index();
      t.specificType('name', 'citext').unique().index();
      t.timestamp('signedInAt');
      t.timestamp('expiredTokensAt');
      t.timestamp('createdAt').defaultTo('now()');
    })

    .createTable('maps', t => {
      t.increments();
      t.string('name').notNullable().unique();
      t.timestamps();
    })

    .createTable('games', t => {
      t.increments();
      t.integer('map_id').notNullable().references('id').inTable('maps');
      t.string('name');
      t.string('email').notNullable().unique();
      t.timestamps();
    })

    .createTable('scores', t => {
      t.increments();
      t.integer('user_id').notNullable().references('id').inTable('users');
      t.integer('game_id').notNullable().references('id').inTable('games');
      t.unique(['game_id', 'user_id']);
      t.timestamps();
    });

export const down = ({schema}) =>
  schema
    .dropTable('scores')
    .dropTable('games')
    .dropTable('maps')
    .dropTable('users');
