import THREE from 'three';

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
camera.up = new THREE.Vector3(0, 0, 1);

const handleResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};

handleResize();
window.addEventListener('resize', handleResize);

export default camera;
