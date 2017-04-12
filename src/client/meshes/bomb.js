import {Mesh, MeshLambertMaterial, SphereGeometry} from 'three';
import config from '../../shared/config';

const GEOMETRY = new SphereGeometry(config.game.bombRadius, 16, 16);

const ACTIVE_MATERIAL = new MeshLambertMaterial({color: 0x333333});

const USED_MATERIAL = ACTIVE_MATERIAL.clone();
USED_MATERIAL.transparent = true;
USED_MATERIAL.opacity = 0.25;

export default class extends Mesh {
  static ACTIVE_MATERIAL = ACTIVE_MATERIAL;
  static USED_MATERIAL = USED_MATERIAL;

  constructor({x, y}) {
    super(GEOMETRY, ACTIVE_MATERIAL);
    this.position.set(x, y, config.game.bombRadius);
    this.castShadow = true;
  }
}
