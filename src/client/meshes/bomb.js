import config from '../../shared/config';
import THREE from 'three';

const GEOMETRY = new THREE.SphereGeometry(config.game.bombRadius, 16, 16);

const ACTIVE_MATERIAL = new THREE.MeshLambertMaterial({color: 0x333333});

const USED_MATERIAL = ACTIVE_MATERIAL.clone();
USED_MATERIAL.transparent = true;
USED_MATERIAL.opacity = 0.25;

export default class extends THREE.Mesh {
  constructor({x, y}) {
    super(GEOMETRY, ACTIVE_MATERIAL);
    this.position.set(x, y, config.game.bombRadius);
    this.cashShadow = true;
  }
}
