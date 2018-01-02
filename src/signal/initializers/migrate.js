const db = require('../utils/db');

db.migrate.latest({directory: 'src/signal/migrations'}).catch(er => {
  console.error(er);
  process.exit(1);
});
