import b2 from 'box2d';
import BallBody from 'shared/bodies/ball';
import config from 'shared/config';

var BallMesh = config.node ? null : require('client/meshes/ball');
var THREE = config.node ? null : require('three');

var UP = config.node ? null : new THREE.Vector3(0, 0, 1);
var DIAMETER = 2 * Math.PI * config.game.ballRadius;

export var preStep = function (user) {
  var position = user.ball.body.GetPosition();
  user.prevX = position.get_x();
  user.prevY = position.get_y();
  var speed = user.ball.body.GetLinearVelocity().Length();
  var delta = Math.min(config.game.maxSpeed - speed, config.game.acceleration);
  var force = new b2.b2Vec2(
    user.acceleration.get_x() * delta,
    user.acceleration.get_y() * delta
  );
  user.ball.body.ApplyLinearImpulse(force);
  b2.destroy(force);
};

export var postStep = function (user) {
  var body = user.ball.body;
  var mesh = user.ball.mesh;
  var position = body.GetPosition();
  var x = position.get_x();
  var y = position.get_y();
  mesh.position.x = x;
  mesh.position.y = y;
  var v3 = new THREE.Vector3(user.prevX - x, user.prevY - y, 0);
  var theta = v3.length() * DIAMETER;
  var axis = v3.cross(UP).normalize();
  mesh.matrix =
    (new THREE.Matrix4()).makeRotationAxis(axis, theta).multiply(mesh.matrix);
  mesh.rotation.copy((new THREE.Euler()).setFromRotationMatrix(mesh.matrix));
};

export var create = function (game) {
  return {
    body: BallBody.create(game.world),
    mesh: config.node ? null : BallMesh.create(game.scene),
    preStep: preStep,
    postStep: postStep
  };
};

export var destroy = function (ball, game) {
  BallBody.destroy(ball.body, game.world);
  if (!config.node) BallMesh.destroy(ball.mesh, game.scene);
};
