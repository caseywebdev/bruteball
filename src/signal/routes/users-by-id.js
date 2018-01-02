const crypto = require('crypto');
const db = require('../utils/db');
const _ = require('underscore');

const hash = str => crypto.createHash('md5').update(str).digest('hex');

module.exports = {
  'usersById.$keys.$keys':
  ({1: ids, 2: fields}) =>
    db('users').select('*').whereIn('id', ids).then(users => {
      const byId = _.indexBy(users, 'id');
      return {
        usersById: _.reduce(ids, (usersById, id) => {
          const user = byId[id];
          if (user) {
            usersById[id] = {
              $merge: _.reduce(fields, (values, field) => {
                values[field] = user[field];
                if (field === 'emailHash') {
                  values[field] = hash(user.emailAddress);
                }
                if (values[field] === undefined) values[field] = null;
                return values;
              }, {})
            };
          } else {
            usersById[id] = {$set: null};
          }

          return usersById;
        }, {})
      };
    })
};
