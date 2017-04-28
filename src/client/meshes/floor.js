import {
  Mesh,
  MeshLambertMaterial,
  PlaneBufferGeometry,
  RepeatWrapping,
  TextureLoader
} from 'three';

const MAP_SIZE = 32;

const GEOMETRY = new PlaneBufferGeometry(MAP_SIZE, MAP_SIZE);

const TEXTURE = (new TextureLoader()).load('/textures/dirt.jpg');
TEXTURE.wrapS = TEXTURE.wrapT = RepeatWrapping;
TEXTURE.repeat.set(5, 5);

const MATERIAL = new MeshLambertMaterial({map: TEXTURE});

export default class extends Mesh {
  constructor() {
    super(GEOMETRY, MATERIAL);
    this.receiveShadow = true;
    this.position.set(MAP_SIZE / 2, MAP_SIZE / 2, 0);
  }
}
