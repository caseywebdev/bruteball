import config from 'shared/config';
import WallBody from 'shared/bodies/wall';

var WallMesh = config.node ? null : require('shared/meshes/wall');

export var create = function (game, x, y) {
  var wall = {};
  var body = wall.body = WallBody.create(game.world, x, y);
  if (!config.node) {
    var mesh = wall.mesh = WallMesh.create(game.scene);
    var position = body.GetPosition();
    mesh.position.x = position.get_x();
    mesh.position.y = -position.get_y();
  }
  return wall;
};
