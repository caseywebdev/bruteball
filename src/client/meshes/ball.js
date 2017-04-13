import {
  ImageUtils,
  Mesh,
  MeshLambertMaterial,
  NearestFilter,
  RepeatWrapping,
  SphereGeometry
} from 'three';
import config from '../../shared/config';

const GEOMETRY = new SphereGeometry(config.game.ballRadius, 16, 16);

const TEXTURE_URL = '/textures/checker.jpg';
const DIFFUSE_TEXTURE = ImageUtils.loadTexture(TEXTURE_URL);
DIFFUSE_TEXTURE.wrapS = RepeatWrapping;
DIFFUSE_TEXTURE.repeat.set(2, 1);
DIFFUSE_TEXTURE.magFilter = NearestFilter;

const MATERIAL = new MeshLambertMaterial({
  map: DIFFUSE_TEXTURE,
  color: 0x6666ff
});

export default class extends Mesh {
  constructor({x, y}) {
    super(GEOMETRY, MATERIAL);
    this.position.set(x, y, config.game.ballRadius);
    this.castShadow = true;
  }
}
