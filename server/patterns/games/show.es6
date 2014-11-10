import _ from 'underscore';
import bombPattern from 'patterns/games/show-bomb';
import boostPattern from 'patterns/games/show-boost';
import hatPattern from 'patterns/games/show-hat';
import userPattern from 'patterns/games/show-user';

var PATTERNS = {
  bomb: bombPattern,
  boost: boostPattern,
  hat: hatPattern,
  user: userPattern
};

export default function (game, options) {
  var obj = _.pick(game, 'id');
  obj.s = game.step;
  var objects = options && options.objects || game.changed;
  _.each(_.unique(objects), function (object) {
    var type = object.type;
    var pattern = PATTERNS[type];
    if (!pattern) return;
    if (!obj.o) obj.o = {};
    if (!obj.o[type]) obj.o[type] = [];
    obj.o[type].push(pattern(object));
  });
  return obj;
}
