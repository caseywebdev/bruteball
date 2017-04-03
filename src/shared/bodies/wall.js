import b2 from 'box2d.js';
import createVerticesPointer from 'shared/utils/create-vertices-pointer';

var BODY_DEF = new b2.b2BodyDef();

var FIXTURE_DEF = new b2.b2FixtureDef();
FIXTURE_DEF.set_restitution(0.2);
FIXTURE_DEF.set_friction(0);

export var create = function (options) {
  var shape = new b2.b2PolygonShape();
  shape.Set(createVerticesPointer(options.points), options.points.length);
  BODY_DEF.get_position().Set(options.x, options.y);
  var body = options.game.world.CreateBody(BODY_DEF);
  FIXTURE_DEF.set_shape(shape);
  body.CreateFixture(FIXTURE_DEF);
  b2.destroy(shape);
  return body;
};
