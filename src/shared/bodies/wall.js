import b2 from 'box2d.js';
import createVerticesPointer from '../utils/create-vertices-pointer';

const BODY_DEF = new b2.b2BodyDef();

const FIXTURE_DEF = new b2.b2FixtureDef();
FIXTURE_DEF.set_restitution(0.2);
FIXTURE_DEF.set_friction(0);

export default ({game, points, x, y}) => {
  const shape = new b2.b2PolygonShape();
  shape.Set(createVerticesPointer(points), points.length);
  BODY_DEF.get_position().Set(x, y);
  const body = game.world.CreateBody(BODY_DEF);
  FIXTURE_DEF.set_shape(shape);
  body.CreateFixture(FIXTURE_DEF);
  b2.destroy(shape);
  return body;
};
