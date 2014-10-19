import THREE from 'three';

var GEOMETRY = new THREE.SphereGeometry(0.5, 32, 32);

var TEXTURE_URL = '/textures/ball-diffuse.jpg';
var DIFFUSE_TEXTURE = THREE.ImageUtils.loadTexture(TEXTURE_URL);
DIFFUSE_TEXTURE.wrapS = THREE.RepeatWrapping;
DIFFUSE_TEXTURE.repeat.set(2, 1);
DIFFUSE_TEXTURE.magFilter = THREE.NearestFilter;

var MATERIAL = new THREE.MeshPhongMaterial({
  map: DIFFUSE_TEXTURE
});

export var create = function () {
  var ball = new THREE.Mesh(GEOMETRY, MATERIAL);
  ball.position.z = 0.5;
  ball.castShadow = true;
  return ball;
};

// GLOWING BALL
// var customMaterial = new THREE.ShaderMaterial({
//   uniforms: {
//     c: {type: 'f', value: 1.0},
//     p: {type: 'f', value: 1.4},
//     glowColor: {type: 'c', value: new THREE.Color(0x00ff00)},
//     viewVector: {type: 'v3', value: this.camera.position}
//   },
//   vertexShader: glowVertexShader,
//   fragmentShader: glowFragmentShader,
//   side: THREE.FrontSide,
//   blending: THREE.AdditiveBlending,
//   transparent: true
// });
// var moonGlow = new THREE.Mesh(geometry.clone(), customMaterial.clone());
// moonGlow.position.x = ball.position.x;
// moonGlow.position.y = ball.position.y;
// moonGlow.position.z = ball.position.z;
// moonGlow.scale.multiplyScalar(1.2);
// this.scene.add(moonGlow);
