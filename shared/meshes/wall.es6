import THREE from 'three';

var GEOMETRY = new THREE.BoxGeometry(1, 1, 1);

var TEXTURE_URL = '/textures/wall-diffuse.jpg';
var DIFFUSE_TEXTURE = THREE.ImageUtils.loadTexture(TEXTURE_URL);

var MATERIAL = new THREE.MeshBasicMaterial({map: DIFFUSE_TEXTURE});

export var create = function (scene) {
  var mesh = new THREE.Mesh(GEOMETRY, MATERIAL);
  mesh.position.z = 0.5;
  mesh.castShadow = true;
  scene.add(mesh);
  return mesh;
};
