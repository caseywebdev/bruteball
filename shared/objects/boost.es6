import _ from 'underscore';
import BoostBody from 'shared/bodies/boost';
import config from 'shared/config';
import Game from 'shared/objects/game';

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
    usedAt: -config.game.boostWait
  };
};

export var isUsed = function (boost) {
  return boost.game.step - boost.usedAt < config.game.boostWait;
};

export var updateMesh = function (boost) {
  var mesh = boost.mesh;
  if (isUsed(boost)) {
    mesh.material = BoostMesh.USED_MATERIAL;
    mesh.castShadow = false;
  } else {
    mesh.material = BoostMesh.ACTIVE_MATERIAL;
    mesh.castShadow = true;
  }
};

export var fire = function (boost, user) {
  if (isUsed(boost)) return;
  var velocity = user.body.GetLinearVelocity();
  var speed = velocity.Normalize() + 15;
  velocity.Set(velocity.get_x() * speed, velocity.get_y() * speed);
  user.body.SetLinearVelocity(velocity);
  boost.usedAt = boost.game.step;
  boost.game.changed.push(boost, user);
};

export var applyFrame = function (game, b) {
  var boost = Game.findObject(game, {type: 'boost', id: b[0]});
  boost.usedAt = b[1];
};

