import {Circle, Vec2} from 'planck-js';
import config from '../config';

const {hatRadius} = config.game;

const FIXTURE_DEF = {
  shape: new Circle(hatRadius),
  isSensor: true
};

export default ({game, x, y}) => {
  const body = game.world.createBody();
  body.setPosition(new Vec2(x, y));
  body.createFixture(FIXTURE_DEF);
  return body;
};
