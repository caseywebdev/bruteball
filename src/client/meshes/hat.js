import config from '../../shared/config';
import {
  Mesh,
  MeshLambertMaterial,
  SphereGeometry
} from 'three';

const GEOMETRY = new SphereGeometry(config.game.hatRadius, 16, 16);

const MATERIAL = new MeshLambertMaterial({color: 0xF4A460});

export default class extends Mesh {
  constructor({x, y}) {
    super(GEOMETRY, MATERIAL);
    this.position.set(x, y, config.game.ballRadius * 2);
    this.castShadow = true;
  }
}
