import config from 'shared/config';
import THREE from 'three';

var GEOMETRY = new THREE.SphereGeometry(config.game.ballRadius, 16, 16);

var TEXTURE_URL = '/textures/ball.jpg';
var DIFFUSE_TEXTURE = THREE.ImageUtils.loadTexture(TEXTURE_URL);
DIFFUSE_TEXTURE.wrapS = THREE.RepeatWrapping;
DIFFUSE_TEXTURE.repeat.set(2, 1);
DIFFUSE_TEXTURE.magFilter = THREE.NearestFilter;

var MATERIAL = new THREE.MeshLambertMaterial({map: DIFFUSE_TEXTURE});

export var create = function (options) {
  var mesh = new THREE.Mesh(GEOMETRY, MATERIAL);
  mesh.position.z = config.game.ballRadius;
  mesh.castShadow = true;
  options.game.scene.add(mesh);
  return mesh;
};
