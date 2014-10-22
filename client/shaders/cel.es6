import THREE from 'three';
import fragmentShader from 'client/shaders/cel-fragment';
import vertexShader from 'client/shaders/cel-vertex';

export default {
  uniforms: {
    uBaseColor: {type: 'c', value: new THREE.Color(0xeeeeee)}
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader
};
