import config from '../../shared/config';
import THREE from 'three';

const GEOMETRY = new THREE.SphereGeometry(config.game.hatRadius, 16, 16);

const MATERIAL = new THREE.MeshLambertMaterial({color: 0xF4A460});

export default class extends THREE.Mesh {
  constructor({x, y}) {
    super(GEOMETRY, MATERIAL);
    this.position.set(x, y, config.game.ballRadius * 2);
    this.cashShadow = true;
  }
}
