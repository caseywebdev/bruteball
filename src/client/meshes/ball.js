import {
  Mesh,
  MeshLambertMaterial,
  RepeatWrapping,
  SphereGeometry,
  TextureLoader
} from 'three';
import config from '../../shared/config';

const GEOMETRY = new SphereGeometry(config.game.ballRadius, 16, 16);

const TEXTURE = (new TextureLoader()).load('/textures/rocks.png');
TEXTURE.wrapS = TEXTURE.wrapT = RepeatWrapping;

const MATERIAL = new MeshLambertMaterial({map: TEXTURE});

export default class extends Mesh {
  constructor({x, y}) {
    super(GEOMETRY, MATERIAL);
    this.position.set(x, y, config.game.ballRadius);
    this.castShadow = true;
  }
}
