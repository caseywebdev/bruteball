import _ from 'underscore';
import BoostBody from 'shared/bodies/boost';
import config from 'shared/config';

var BoostMesh = config.node ? null : require('client/meshes/boost');

export var create = function (options) {
  options = _.extend({}, options, {
    x: options.x + 0.5,
    y: options.y + 0.5
  });
  return {
    type: 'boost',
    id: ++options.game.incr,
    game: options.game,
    body: BoostBody.create(options),
    mesh: config.node ? null : BoostMesh.create(options),
    lastBroadcast: 0,
    needsBroadcast: 0
  };
};
