import THREE from 'three';
import fragmentShader from 'client/shaders/cel-fragment';
import vertexShader from 'client/shaders/cel-vertex';

export default {
  uniforms: {
    uDirLightPos: {type: 'v3', value: new THREE.Vector3(1, 0, 0)},
    uDirLightColor: {type: 'c', value: new THREE.Color(0xeeeeee)},
    uAmbientLightColor: {type: 'c', value: new THREE.Color(0x050505)},
    uBaseColor: {type: 'c', value: new THREE.Color(0xff0000)}
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader
};
