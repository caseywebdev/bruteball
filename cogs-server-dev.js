var configPath = './cogs-server.json';
delete require.cache[require.resolve(configPath)];
var config = require(configPath);
for (var key in config) exports[key] = config[key];
exports.watch = [
  'server',
  'shared'
];
exports['use-polling'] = true;
