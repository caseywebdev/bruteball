import b2 from 'box2d.js';
import config from '../config';

const BODY_DEF = new b2.b2BodyDef();
BODY_DEF.set_type(b2.b2_dynamicBody);
BODY_DEF.set_fixedRotation(true);
BODY_DEF.set_linearDamping(config.game.linearDamping);

const SHAPE = new b2.b2CircleShape();
SHAPE.set_m_radius(config.game.ballRadius);

const FIXTURE_DEF = new b2.b2FixtureDef();
FIXTURE_DEF.set_shape(SHAPE);
FIXTURE_DEF.set_density(1);
FIXTURE_DEF.set_restitution(0.2);
FIXTURE_DEF.set_friction(0);

export default ({game, x, y}) => {
  BODY_DEF.get_position().Set(x, y);
  var body = game.world.CreateBody(BODY_DEF);
  body.CreateFixture(FIXTURE_DEF);
  return body;
};
