import _ from 'underscore';
import b2 from 'box2d';
import BoostBody from 'shared/bodies/boost';
import config from 'shared/config';

var BoostMesh = config.node ? null : require('client/meshes/boost');
var THREE = config.node ? null : require('three');

export var create = function (options) {
  options = _.extend({x: 8, y: 8}, options);
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
