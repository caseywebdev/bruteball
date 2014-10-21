import _ from 'underscore';
import THREE from 'three';

var TEXTURE_URL = '/textures/wall.jpg';
var DIFFUSE_TEXTURE = THREE.ImageUtils.loadTexture(TEXTURE_URL);

var MATERIAL = new THREE.MeshLambertMaterial({
  map: DIFFUSE_TEXTURE,
  color: 0xff0000
});

export var create = function (options) {
  var shape = new THREE.Shape(_.map(options.points, function (point) {
    return new THREE.Vector2(point.x, point.y);
  }));

  var geometry = new THREE.ExtrudeGeometry(shape, {
    amount: 1,
    steps: 1,
    bevelEnabled: false
  });
  var mesh = new THREE.Mesh(geometry, MATERIAL);
  mesh.position.z = 0;
  mesh.castShadow = true;
  options.game.scene.add(mesh);
  return mesh;
};
