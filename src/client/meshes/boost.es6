import config from 'shared/config';
import THREE from 'three';

var GEOMETRY = new THREE.SphereGeometry(config.game.boostRadius, 16, 16);

export var ACTIVE_MATERIAL = new THREE.MeshLambertMaterial({color: 0xf1df23});

export var USED_MATERIAL = ACTIVE_MATERIAL.clone();
USED_MATERIAL.transparent = true;
USED_MATERIAL.opacity = 0.25;

export var create = function (options) {
  var mesh = new THREE.Mesh(GEOMETRY, ACTIVE_MATERIAL);
  mesh.position.set(options.x, options.y, config.game.boostRadius);
  mesh.castShadow = true;
  options.game.scene.add(mesh);
  return mesh;
};
