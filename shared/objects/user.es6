import _ from 'underscore';
import b2 from 'box2d';
import BallBody from 'shared/bodies/ball';
import config from 'shared/config';
import Game from 'shared/objects/game';
import Hat from 'shared/objects/hat';

var BallMesh = config.node ? null : require('client/meshes/ball');
var THREE = config.node ? null : require('three');

var DT = config.game.dt;
var UP = config.node ? null : new THREE.Vector3(0, 0, 1);

export var preStep = function (user) {
  var acceleration = user.acceleration;
  if (!acceleration.Length()) return;
  var velocity = user.body.GetLinearVelocity();
  var speed = velocity.Length();
  var maxSpeed = Math.max(config.game.maxSpeed, speed);
  velocity.Set(
    velocity.get_x() + (acceleration.get_x() * config.game.acceleration * DT),
    velocity.get_y() + (acceleration.get_y() * config.game.acceleration * DT)
  );
  if (velocity.Length() > maxSpeed) {
    velocity.Normalize();
    velocity.Set(velocity.get_x() * maxSpeed, velocity.get_y() * maxSpeed);
  }
  user.body.SetLinearVelocity(velocity);
};

export var applyFrame = function (game, u, step) {
  if (step !== game.step) return;
  var id = u[0];
  var user = Game.createObject(game, {type: 'user', id: id});
  var position = user.body.GetPosition();
  position.Set(u[1], u[2]);
  user.body.SetTransform(position, user.body.GetAngle());
  var velocity = user.body.GetLinearVelocity();
  velocity.Set(u[3], u[4]);
  user.body.SetLinearVelocity(velocity);
  user.acceleration.Set(u[5], u[6]);
};

export var updateMesh = function (user) {
  var position = user.body.GetPosition();
  var mesh = user.mesh;
  var delta = mesh.position.clone();
  mesh.position.x = position.get_x();
  mesh.position.y = position.get_y();
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
    lastBroadcast: 0,
    needsBroadcast: 0
  };
};

export var hit = function (a, b) {
  var hat = _.find(a.game.objects, {type: 'hat'});
  var hitter = hat.usedBy === a.id ? b : hat.usedBy === b.id ? a : null;
  if (!hitter) return;
  Hat.drop(hat);
  Hat.use(hat, hitter);
};

export var destroy = function (user) {
  b2.destroy(user.acceleration);
  var game = user.game;
  game.world.DestroyBody(user.body);
  _.each(_.filter(game.objects, {type: 'hat', usedBy: user.id}), Hat.drop);
  if (!config.node) user.game.scene.remove(user.mesh);
};
