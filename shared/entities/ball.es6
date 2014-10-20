import BallBody from 'shared/bodies/ball';
import config from 'shared/config';

var BallMesh = config.node ? null : require('shared/meshes/ball');
var THREE = config.node ? null : require('three');

var UP = config.node ? null : new THREE.Vector3(0, 0, 1);

export var create = function (game) {
  return {
    body: BallBody.create(game.world),
    mesh: config.node ? null : BallMesh.create(game.scene)
  };
};

export var destroy = function (ball, game) {
  BallBody.destroy(ball.body, game.world);
  if (!config.node) BallMesh.destroy(ball.mesh, game.scene);
};

export var updateMesh = function (ball, dt) {
  var body = ball.body;
  var mesh = ball.mesh;
  var position = body.GetPosition();
  mesh.position.x = position.get_x();
  mesh.position.y = -position.get_y();
  var v2 = body.GetLinearVelocity();
  var v3 = new THREE.Vector3(-v2.get_x(), v2.get_y(), 0);
  var theta = v3.length() * Math.PI * dt;
  var axis = v3.cross(UP).normalize();
  mesh.matrix =
    (new THREE.Matrix4()).makeRotationAxis(axis, theta).multiply(mesh.matrix);
  mesh.rotation.copy((new THREE.Euler()).setFromRotationMatrix(mesh.matrix));
};
