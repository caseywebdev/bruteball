import b2 from 'box2d.js';
import config from '../config';

const BODY_DEF = new b2.b2BodyDef();

const SHAPE = new b2.b2CircleShape();
SHAPE.set_m_radius(config.game.hatRadius);

const FIXTURE_DEF = new b2.b2FixtureDef();
FIXTURE_DEF.set_shape(SHAPE);
FIXTURE_DEF.set_isSensor(true);

export default ({game, x, y}) => {
  BODY_DEF.get_position().Set(x, y);
  const body = game.world.CreateBody(BODY_DEF);
  body.CreateFixture(FIXTURE_DEF);
  return body;
};
