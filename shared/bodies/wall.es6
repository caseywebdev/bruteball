import b2 from 'box2d';

var BODY_DEF = new b2.b2BodyDef();

var FIXTURE_DEF = new b2.b2FixtureDef();
FIXTURE_DEF.set_restitution(0.2);

export var create = function (options) {
  var shape = b2.CreatePolygonShape(options.points);
  BODY_DEF.get_position().set_x(options.x - 0.5);
  BODY_DEF.get_position().set_y(options.y - 0.5);
  var body = options.game.world.CreateBody(BODY_DEF);
  FIXTURE_DEF.set_shape(shape);
  body.CreateFixture(FIXTURE_DEF);
  b2.destroy(shape);
  return body;
};
