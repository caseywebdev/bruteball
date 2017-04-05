import config from '../../shared/config';
import THREE from 'three';

const GEOMETRY = new THREE.SphereGeometry(config.game.ballRadius, 16, 16);

const TEXTURE_URL = '/textures/checker.jpg';
const DIFFUSE_TEXTURE = THREE.ImageUtils.loadTexture(TEXTURE_URL);
DIFFUSE_TEXTURE.wrapS = THREE.RepeatWrapping;
DIFFUSE_TEXTURE.repeat.set(2, 1);
DIFFUSE_TEXTURE.magFilter = THREE.NearestFilter;

const MATERIAL = new THREE.MeshLambertMaterial({map: DIFFUSE_TEXTURE});

export default class extends THREE.Mesh {
  constructor({x, y}) {
    super(GEOMETRY, MATERIAL);
    this.setPosition(x, y, config.game.ballRadius);
    this.castShadow = true;
  }
}
