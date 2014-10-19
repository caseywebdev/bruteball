import BallBody from 'shared/bodies/ball';
import config from 'shared/config';

var BallMesh = config.node ? null : require('shared/meshes/ball');

export var create = function (world) {
  return {
    body: BallBody.create(world),
    mesh: config.node ? null : BallMesh.create()
  };
};
