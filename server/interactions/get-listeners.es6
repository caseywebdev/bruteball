import _ from 'underscore';
import fs from 'fs';
import path from 'path';

export default function (dir) {
  return _.reduce(
    fs.readdirSync(dir),
    function (listeners, file) {
      if (file[0] !== '.') {
        var basename = path.basename(file, path.extname(file));
        listeners[basename] = require(path.join(dir, file)).default;
      }
      return listeners;
    },
    {}
  );
}
