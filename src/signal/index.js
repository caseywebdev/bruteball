(async () => {
  try {
    await require('./initializers/migrate')();
    await require('./initializers/live')();
  } catch (er) {
    console.error(er);
    process.exit(1);
  }
})();
