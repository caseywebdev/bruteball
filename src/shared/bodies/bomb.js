import {Circle, Vec2} from 'planck-js';
import config from '../config';

const {bombRadius} = config.game;

const FIXTURE_DEF = {
  shape: new Circle(bombRadius),
  isSensor: true
};

export default ({game, x, y}) => {
  const body = game.world.createBody();
  body.setPosition(new Vec2(x, y));
  body.createFixture(FIXTURE_DEF);
  return body;
};
