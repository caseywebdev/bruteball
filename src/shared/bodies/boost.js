import {Circle, Vec2} from 'matter-js';
import config from '../config';

const {boostRadius} = config.game;

const FIXTURE_DEF = {
  shape: new Circle(boostRadius),
  isSensor: true
};

export default ({game, x, y}) => {
  const body = game.world.createBody();
  body.setPosition(new Vec2(x, y));
  body.createFixture(FIXTURE_DEF);
  return body;
};
