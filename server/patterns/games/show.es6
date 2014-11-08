import _ from 'underscore';

export default function (game) {
  var obj = _.pick(game, 'id');
  obj.s = game.step;
  _.each(_.unique(game.changed), function (object) {
    var type = object.type;
    if (!obj.o) obj.o = {};
    if (!obj.o[type]) obj.o[type] = [];
    obj.o[type].push(require('patterns/games/show-' + type).default(object));
  });
  return obj;
}
