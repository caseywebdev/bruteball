var _ = require('underscore');
var fs = require('fs');
var path = require('path');

module.exports = function (dir) {
  return _.reduce(
    fs.readdirSync(dir),
    function (listeners, file) {
      if (file[0] !== '.') {
        var basename = path.basename(file, path.extname(file));
        listeners[basename] = require(path.join(dir, file));
      }
      return listeners;
    },
    {}
  );
};
