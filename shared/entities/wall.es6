import _ from 'underscore';
import config from 'shared/config';
import WallBody from 'shared/bodies/wall';

var WallMesh = config.node ? null : require('shared/meshes/wall');

var BOTTOM_LEFT = {x: 0, y: 0};
var BOTTOM_RIGHT = {x: 1, y: 0};
var TOP_RIGHT = {x: 1, y: 1};
var TOP_LEFT = {x: 0, y: 1};

export var SQUARE = [BOTTOM_LEFT, BOTTOM_RIGHT, TOP_RIGHT, TOP_LEFT];
export var WITHOUT_BOTTOM_LEFT = _.without(SQUARE, BOTTOM_LEFT);
export var WITHOUT_BOTTOM_RIGHT = _.without(SQUARE, BOTTOM_RIGHT);
export var WITHOUT_TOP_RIGHT = _.without(SQUARE, TOP_RIGHT);
export var WITHOUT_TOP_LEFT = _.without(SQUARE, TOP_LEFT);

export var create = function (options) {
  options = _.extend({}, {points: SQUARE}, options);
  var wall = {};
  var body = wall.body = WallBody.create(options);
  if (options.game.scene) {
    var mesh = wall.mesh = WallMesh.create(options);
    var position = body.GetPosition();
    mesh.position.x = position.get_x();
    mesh.position.y = position.get_y();
  }
  return wall;
};
