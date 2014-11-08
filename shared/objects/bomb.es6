import _ from 'underscore';
import BombBody from 'shared/bodies/bomb';
import config from 'shared/config';
import Game from 'shared/objects/game';

var BombMesh = config.node ? null : require('client/meshes/bomb');

var BLAST_RADIUS = 5;
var POWER = 5;

export var create = function (options) {
  options = _.extend({}, options, {
    x: options.x + 0.5,
    y: options.y + 0.5
  });
  return {
    type: 'bomb',
    id: ++options.game.incr,
    game: options.game,
    body: BombBody.create(options),
    mesh: config.node ? null : BombMesh.create(options),
    usedAt: -config.game.bombWait
  };
};

export var isUsed = function (bomb) {
  return bomb.game.step - bomb.usedAt < config.game.bombWait;
};

export var updateMesh = function (bomb) {
  var mesh = bomb.mesh;
  if (isUsed(bomb)) {
    mesh.material = BombMesh.USED_MATERIAL;
    mesh.castShadow = false;
  } else {
    mesh.material = BombMesh.ACTIVE_MATERIAL;
    mesh.castShadow = true;
  }
};

export var explode = function (bomb) {
  if (isUsed(bomb)) return;
  var epicenter = bomb.body.GetPosition();
  var bombX = epicenter.get_x();
  var bombY = epicenter.get_y();
  bomb.usedAt = bomb.game.step;
  bomb.game.changed.push(bomb);
  _.each(bomb.game.objects, function (object) {
    if (object.type !== 'user') return;
    var body = object.body;
    var position = body.GetPosition();
    var dx = position.get_x() - bombX;
    var dy = position.get_y() - bombY;
    var distance = Math.sqrt((dx * dx) + (dy * dy));
    if (distance > BLAST_RADIUS) return;
    var speed = (BLAST_RADIUS - distance) * POWER;
    var velocity = object.body.GetLinearVelocity();
    velocity.Set(
      velocity.get_x() + (dx * speed),
      velocity.get_y() + (dy * speed)
    );
    body.SetLinearVelocity(velocity);
    bomb.game.changed.push(object);
  });
};

export var applyFrame = function (game, b) {
  var bomb = Game.findObject(game, {type: 'bomb', id: b[0]});
  bomb.usedAt = b[1];
};
