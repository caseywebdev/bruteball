import b2 from 'box2d';

var BODY_DEF = new b2.b2BodyDef();

var SHAPE = new b2.b2PolygonShape();
SHAPE.SetAsBox(0.5, 0.5);

var FIXTURE_DEF = new b2.b2FixtureDef();
FIXTURE_DEF.set_shape(SHAPE);

export var create = function (world, x, y) {
  BODY_DEF.get_position().set_x(x - 0.5);
  BODY_DEF.get_position().set_y(y - 0.5);
  var body = world.CreateBody(BODY_DEF);
  body.CreateFixture(FIXTURE_DEF);
  return body;
};
