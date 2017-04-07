import {CircleShape, Vec2} from 'planck-js';
import config from '../config';

const {ballRadius, linearDamping} = config.game;

const BODY_DEF = {
  type: 'dynamic',
  fixedRotation: true,
  linearDamping
};

const FIXTURE_DEF = {
  shape: new CircleShape(ballRadius),
  density: 1,
  restitution: 0.2,
  friction: 0
};

export default ({game, x, y}) => {
  const body = game.world.createBody(BODY_DEF);
  body.setPosition(new Vec2(x, y));
  body.createFixture(FIXTURE_DEF);
  return body;
};
