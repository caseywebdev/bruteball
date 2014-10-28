import THREE from 'three';

var GEOMETRY = new THREE.SphereGeometry(0.49, 16, 16);

var TEXTURE_URL = '/textures/ball.jpg';
var DIFFUSE_TEXTURE = THREE.ImageUtils.loadTexture(TEXTURE_URL);
DIFFUSE_TEXTURE.wrapS = THREE.RepeatWrapping;
DIFFUSE_TEXTURE.repeat.set(2, 1);
DIFFUSE_TEXTURE.magFilter = THREE.NearestFilter;

var MATERIAL = new THREE.MeshLambertMaterial({map: DIFFUSE_TEXTURE});

export var create = function (scene) {
  var mesh = new THREE.Mesh(GEOMETRY, MATERIAL);
  mesh.position.z = 0.49;
  mesh.castShadow = true;
  scene.add(mesh);
  return mesh;
};

export var destroy = function (mesh, scene) {
  scene.remove(mesh);
};
