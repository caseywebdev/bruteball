import _ from 'underscore';
import {
  ExtrudeGeometry,
  Mesh,
  MeshLambertMaterial,
  Shape,
  Vector2
} from 'three';

const EXTRUDE_OPTIONS = {amount: 1, steps: 1, bevelEnabled: false};

const MATERIAL = new MeshLambertMaterial({color: 0xff0000});

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
