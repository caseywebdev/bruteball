import {
  Mesh,
  MeshLambertMaterial,
  PlaneBufferGeometry
} from 'three';

const MAP_SIZE = 32;

const GEOMETRY = new PlaneBufferGeometry(MAP_SIZE, MAP_SIZE);

const MATERIAL = new MeshLambertMaterial();

export default class extends Mesh {
  constructor() {
    super(GEOMETRY, MATERIAL);
    this.receiveShadow = true;
    this.position.set(MAP_SIZE / 2, MAP_SIZE / 2, 0);
  }
}
