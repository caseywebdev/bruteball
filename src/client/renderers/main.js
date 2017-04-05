import THREE from 'three';

const renderer = new THREE.WebGLRenderer();
renderer.domElement.style.display = 'block';
renderer.shadowMap.cullFace = THREE.CullFaceBack;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const handleResize = () =>
  renderer.setSize(window.innerWidth, window.innerHeight);

handleResize();
window.addEventListener('resize', handleResize);

export default renderer;
