import _ from 'underscore';
import THREE from 'three';

var EXTRUDE_OPTIONS = {amount: 1, steps: 1, bevelEnabled: false};

var MATERIAL = new THREE.MeshLambertMaterial({color: 0xff0000});

var getVectorsFromPoints = function (point) {
  return new THREE.Vector2(point.x, point.y);
};

var getGeometryForPoints = function (points) {
  var vectors = _.map(points, getVectorsFromPoints);
  return new THREE.ExtrudeGeometry(new THREE.Shape(vectors), EXTRUDE_OPTIONS);
};

export var create = function (options) {
  var mesh = new THREE.Mesh(getGeometryForPoints(options.points), MATERIAL);
  mesh.castShadow = true;
  mesh.position.x = options.x;
  mesh.position.y = options.y;
  options.game.scene.add(mesh);
  return mesh;
};
