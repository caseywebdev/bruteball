import {
  Mesh,
  MeshLambertMaterial,
  NearestFilter,
  RepeatWrapping,
  SphereGeometry,
  TextureLoader
} from 'three';
import config from '../../shared/config';

const GEOMETRY = new SphereGeometry(config.game.ballRadius, 16, 16);

const MATERIAL = new MeshLambertMaterial({color: 0x6666ff});

(new TextureLoader()).load(
  '/textures/checker.jpg',
  texture => {
    texture.wrapS = RepeatWrapping;
    texture.repeat.set(2, 1);
    texture.magFilter = NearestFilter;
    MATERIAL.setValues({map: texture});
    MATERIAL.needsUpdate = true;
  }
);

export default class extends Mesh {
  constructor({x, y}) {
    super(GEOMETRY, MATERIAL);
    this.position.set(x, y, config.game.ballRadius);
    this.castShadow = true;
  }
}
