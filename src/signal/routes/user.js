const _str = require('underscore.string');
const config = require('../../shared/config');
const db = require('../utils/db');

const {errors: {authRequired}} = config;

const MAX = config.maxUserNameLength;
const INVALID_NAME = new Error(`Name must be between 1 and ${MAX} characters`);

module.exports = {
  user:
  ({store: {state: {socket: {userId}}}}) =>
    ({user: {$set: userId ? {$ref: ['usersById', userId]} : null}}),

  'updateUser!.$obj':
  ({1: {name}, store: {state: {socket: {userId}}}}) => {
    if (!userId) throw authRequired;

    name = _str.clean(name);
    if (!name || name.length > MAX) throw INVALID_NAME;

    return db('users').where({id: userId}).update({name}).then(() => ({
      usersById: {[userId]: {name: {$set: name}}}
    }));
  }
};
