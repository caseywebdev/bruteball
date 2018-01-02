const shared = require('../shared/config');

const {env} = process;

module.exports = {
  ...shared,
  key: env.KEY,
  name: env.NAME,
  log: {name: 'host'}
};
