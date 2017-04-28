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

const TEXTURE = (new TextureLoader()).load('/textures/checker.jpg');
TEXTURE.wrapS = RepeatWrapping;
TEXTURE.repeat.set(2, 1);
TEXTURE.magFilter = NearestFilter;

const MATERIAL = new MeshLambertMaterial({color: 0x6666ff, map: TEXTURE});

export default class extends Mesh {
  constructor({x, y}) {
    super(GEOMETRY, MATERIAL);
    this.position.set(x, y, config.game.ballRadius);
    this.castShadow = true;
  }
}
