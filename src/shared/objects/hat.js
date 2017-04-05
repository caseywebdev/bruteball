import _ from 'underscore';
import b2 from 'box2d.js';
import * as BombBody from '../bodies/hat';
import config from '../config';

var HatMesh = config.node ? null : require('client/meshes/hat');

export var create = function (options) {
  options = _.extend({}, options, {
    x: options.x + 0.5,
    y: options.y + 0.5
  });
  return {
    type: 'hat',
    id: ++options.game.incr,
    game: options.game,
    body: BombBody.create(options),
    mesh: config.node ? null : HatMesh.create(options),
    home: new b2.b2Vec2(options.x, options.y)
  };
};

export var preStep = function (hat) {
  var position = hat.usedBy ? config.game.hiddenPosition : hat.home;
  hat.body.SetTransform(position, hat.body.GetAngle());
};

export var updateMesh = function (hat) {
  var user = _.find(hat.game.objects, {type: 'user', id: hat.usedBy});
  var position = user ? user.body.GetPosition() : hat.home;
  hat.mesh.position.x = position.get_x();
  hat.mesh.position.y = position.get_y();
};

export var use = function (hat, user) {
  if (hat.usedBy) return;
  hat.usedBy = user.id;
  hat.game.changed.push(hat);
};

export var drop = function (hat) {
  hat.usedBy = null;
  hat.game.changed.push(hat);
};

export var applyFrame = function (game, b) {
  var hat = _.find(game.objects, {type: 'hat', id: b[0]});
  hat.usedBy = b[1];
};

export var destroy = function (hat) {
  b2.destroy(hat.home);
  hat.game.world.DestroyBody(hat.body);
  if (!config.node) hat.game.scene.remove(hat.mesh);
};
