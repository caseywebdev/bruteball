'use strict';

exports.up = function (knex) {
  return knex.schema
    .createTable('users', function (t) {
      t.increments();
      t.string('rand').notNullable().index();
      t.string('name').unique();
      t.string('email').unique().index();
      t.timestamps();
    })

    .createTable('maps', function (t) {
      t.increments();
      t.string('name').notNullable().unique();
      t.timestamps();
    })

    .createTable('games', function (t) {
      t.increments();
      t.integer('map_id').notNullable().references('id').inTable('maps');
      t.string('name');
      t.string('email').notNullable().unique();
      t.timestamps();
    })

    .createTable('scores', function (t) {
      t.increments();
      t.integer('user_id').notNullable().references('id').inTable('users');
      t.integer('game_id').notNullable().references('id').inTable('games');
      t.unique(['game_id', 'user_id']);
      t.timestamps();
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable('scores')
    .dropTable('games')
    .dropTable('maps')
    .dropTable('users');
};
