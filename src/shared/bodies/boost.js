import b2 from 'box2d.js';
import config from 'shared/config';

var BODY_DEF = new b2.b2BodyDef();

var SHAPE = new b2.b2CircleShape();
SHAPE.set_m_radius(config.game.boostRadius);

var FIXTURE_DEF = new b2.b2FixtureDef();
FIXTURE_DEF.set_shape(SHAPE);
FIXTURE_DEF.set_isSensor(true);

export var create = function (options) {
  BODY_DEF.get_position().Set(options.x, options.y);
  var body = options.game.world.CreateBody(BODY_DEF);
  body.CreateFixture(FIXTURE_DEF);
  return body;
};
