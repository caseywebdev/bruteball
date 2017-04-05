import _ from 'underscore';
import THREE from 'three';

const EXTRUDE_OPTIONS = {amount: 1, steps: 1, bevelEnabled: false};

const MATERIAL = new THREE.MeshLambertMaterial({color: 0xff0000});

const getVectorsFromPoints = ({x, y}) => new THREE.Vector2(x, y);

const getGeometryForPoints = points =>
  new THREE.ExtrudeGeometry(
    new THREE.Shape(_.map(points, getVectorsFromPoints)),
    EXTRUDE_OPTIONS
  );

export default class extends THREE.Mesh {
  constructor({points, x, y}) {
    super(getGeometryForPoints(points), MATERIAL);
    this.castShadow = true;
    this.position.x = x;
    this.position.y = y;
  }
}
