const db = require('../utils/db');

module.exports = async () =>
  db.migrate.latest({directory: 'src/signal/migrations'});
