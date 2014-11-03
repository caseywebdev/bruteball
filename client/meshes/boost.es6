import THREE from 'three';

var GEOMETRY = new THREE.SphereGeometry(0.5, 16, 16);

var MATERIAL = new THREE.MeshLambertMaterial({color: 0xf1df23});

export var create = function (options) {
  var mesh = new THREE.Mesh(GEOMETRY, MATERIAL);
  mesh.position.set(options.x, options.y, 0.5);
  mesh.castShadow = true;
  options.game.scene.add(mesh);
  return mesh;
};
