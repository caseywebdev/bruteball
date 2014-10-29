import config from 'shared/config';
import THREE from 'three';

var GEOMETRY = new THREE.SphereGeometry(0.4, 16, 16);

var MATERIAL = new THREE.MeshLambertMaterial({color: 0x333333});

export var create = function (options) {
  var mesh = new THREE.Mesh(GEOMETRY, MATERIAL);
  mesh.position.set(options.x, options.y, 0.4);
  mesh.castShadow = true;
  options.game.scene.add(mesh);
  return mesh;
};
