import _ from 'underscore';
import b2 from 'box2d';
import BombBody from 'shared/bodies/bomb';
import config from 'shared/config';

var BombMesh = config.node ? null : require('client/meshes/bomb');
var THREE = config.node ? null : require('three');

var BLAST_RADIUS = 5;
var POWER = 5;

export var create = function (options) {
  options = _.extend({x: 8, y: 8}, options);
  return {
    type: 'bomb',
    id: ++options.game.incr,
    game: options.game,
    body: BombBody.create(options),
    mesh: config.node ? null : BombMesh.create(options),
    lastBroadcast: 0,
    needsBroadcast: 0
  };
};

export var explode = function (bomb) {
  var epicenter = bomb.body.GetPosition();
  var bombX = epicenter.get_x();
  var bombY = epicenter.get_y();
  _.each(bomb.game.objects, function (object) {
    if (object.type !== 'user') return;
    var body = object.body;
    var position = body.GetPosition();
    var dx = position.get_x() - bombX;
    var dy = position.get_y() - bombY;
    var distance = Math.sqrt((dx * dx) + (dy * dy));
    if (distance > BLAST_RADIUS) return;
    var power = (BLAST_RADIUS - distance) * POWER;
    var velocity = body.GetLinearVelocity();
    var force = new b2.b2Vec2(dx, dy);
    force.Normalize();
    force.Set(force.get_x() * power, force.get_y() * power);
    body.ApplyLinearImpulse(force);
    b2.destroy(force);
  });
};
