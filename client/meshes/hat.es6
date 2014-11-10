import config from 'shared/config';
import THREE from 'three';

var GEOMETRY = new THREE.SphereGeometry(config.game.hatRadius, 16, 16);

export var MATERIAL = new THREE.MeshLambertMaterial({color: 0xF4A460});

export var create = function (options) {
  var mesh = new THREE.Mesh(GEOMETRY, MATERIAL);
  mesh.position.set(options.x, options.y, config.game.ballRadius * 2);
  mesh.castShadow = true;
  options.game.scene.add(mesh);
  return mesh;
};
