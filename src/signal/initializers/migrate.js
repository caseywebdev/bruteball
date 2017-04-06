import db from '../utils/db';

db.migrate.latest({directory: 'build/signal/migrations'}).catch(er => {
  console.error(er);
  process.exit(1);
});
