import b2 from 'box2d';
import config from 'shared/config';

var BODY_DEF = new b2.b2BodyDef();
BODY_DEF.set_type(b2.b2_dynamicBody);
BODY_DEF.set_fixedRotation(true);
BODY_DEF.set_linearDamping(config.game.linearDamping);

var SHAPE = new b2.b2CircleShape();
SHAPE.set_m_radius(config.game.ballRadius);

var FIXTURE_DEF = new b2.b2FixtureDef();
FIXTURE_DEF.set_shape(SHAPE);
FIXTURE_DEF.set_density(1);
FIXTURE_DEF.set_restitution(0.2);
FIXTURE_DEF.set_friction(0);

export var create = function (options) {
  BODY_DEF.get_position().Set(options.x, options.y);
  var body = options.game.world.CreateBody(BODY_DEF);
  body.CreateFixture(FIXTURE_DEF);
  return body;
};
