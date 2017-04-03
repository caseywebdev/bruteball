import THREE from 'three';
import fragmentShader from 'client/shaders/glow-fragment';
import vertexShader from 'client/shaders/glow-vertex';

export default {
  uniforms: {
    c: {type: 'f', value: 1.0},
    p: {type: 'f', value: 1.4},
    glowColor: {type: 'c', value: new THREE.Color(0x00ff00)},
    viewVector: {type: 'v3', value: new THREE.Vector3()}
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader
};
