var configPath = './cogs-client.json';
delete require.cache[require.resolve(configPath)];
var config = require(configPath);
for (var key in config) exports[key] = config[key];
exports.watch = [
  'client',
  'shared',
  'styles'
];
exports['use-polling'] = true;
