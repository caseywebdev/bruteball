import _ from 'underscore';
import b2 from 'box2d';
import BallBody from 'shared/bodies/ball';
import config from 'shared/config';

var BallMesh = config.node ? null : require('client/meshes/ball');
var THREE = config.node ? null : require('three');

var UP = config.node ? null : new THREE.Vector3(0, 0, 1);

export var preStep = function (user) {
  var acceleration = user.acceleration;
  var velocity = user.body.GetLinearVelocity();
  var speed = velocity.Length();
  var nextVelocity = new b2.b2Vec2(
    velocity.get_x() + (acceleration.get_x() * config.game.acceleration),
    velocity.get_y() + (acceleration.get_y() * config.game.acceleration)
  );
  var nextSpeed = nextVelocity.Length();
  b2.destroy(nextVelocity);
  var maxSpeed = Math.max(config.game.maxSpeed, speed);
  var power = Math.min(maxSpeed - nextSpeed, config.game.acceleration);
  var force = new b2.b2Vec2(
    acceleration.get_x() * power,
    acceleration.get_y() * power
  );
  user.body.ApplyLinearImpulse(force);
  b2.destroy(force);
};

export var updateMesh = function (user, dt) {
  var mesh = user.mesh;
  var delta = mesh.position.clone();
  mesh.position.x += user.vx * dt;
  mesh.position.y += user.vy * dt;
  delta.sub(mesh.position);
  var theta = delta.length() / config.game.ballRadius;
  var axis = delta.cross(UP).normalize();
  mesh.matrix =
    (new THREE.Matrix4()).makeRotationAxis(axis, theta).multiply(mesh.matrix);
  mesh.rotation.copy((new THREE.Euler()).setFromRotationMatrix(mesh.matrix));
};

export var create = function (options) {
  options = _.extend({}, options, {
    x: (options.x || 8) + 0.5,
    y: (options.y || 8) + 0.5
  });
  return {
    type: 'user',
    id: options.id,
    game: options.game,
    body: BallBody.create(options),
    mesh: config.node ? null : BallMesh.create(options),
    acceleration: new b2.b2Vec2(0, 0),
    vx: 0,
    vy: 0
  };
};

export var destroy = function (user) {
  b2.destroy(user.acceleration);
  user.game.world.destroy(user.body);
  if (!config.node) user.game.scene.remove(ball.mesh);
};
