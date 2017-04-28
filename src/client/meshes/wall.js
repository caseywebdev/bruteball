import _ from 'underscore';
import {
  ExtrudeGeometry,
  Mesh,
  MeshLambertMaterial,
  Shape,
  Vector2,
  RepeatWrapping,
  TextureLoader
} from 'three';

const EXTRUDE_OPTIONS = {amount: 1, steps: 1, bevelEnabled: false};

const TEXTURE = (new TextureLoader()).load('/textures/dirt.jpg');
TEXTURE.wrapS = TEXTURE.wrapT = RepeatWrapping;
TEXTURE.repeat.set(0.25, 0.25);

const MATERIAL = new MeshLambertMaterial({map: TEXTURE});

const getVectorsFromPoints = ({x, y}) => new Vector2(x, y);

const getGeometryForPoints = points =>
  new ExtrudeGeometry(
    new Shape(_.map(points, getVectorsFromPoints)),
    EXTRUDE_OPTIONS
  );

export default class extends Mesh {
  constructor({points, x, y}) {
    super(getGeometryForPoints(points), MATERIAL);
    this.castShadow = true;
    this.position.x = x;
    this.position.y = y;
  }
}
