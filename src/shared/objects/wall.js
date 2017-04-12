import _ from 'underscore';
import WallBody from '../bodies/wall';

const BOTTOM_LEFT = {x: 0, y: 0};
const BOTTOM_RIGHT = {x: 1, y: 0};
const TOP_RIGHT = {x: 1, y: 1};
const TOP_LEFT = {x: 0, y: 1};
const SQUARE = [BOTTOM_LEFT, BOTTOM_RIGHT, TOP_RIGHT, TOP_LEFT];

export default class {
  static SQUARE = SQUARE;
  static WITHOUT_BOTTOM_LEFT = _.without(SQUARE, BOTTOM_LEFT);
  static WITHOUT_BOTTOM_RIGHT = _.without(SQUARE, BOTTOM_RIGHT);
  static WITHOUT_TOP_RIGHT = _.without(SQUARE, TOP_RIGHT);
  static WITHOUT_TOP_LEFT = _.without(SQUARE, TOP_LEFT);

  constructor({game, id, points = SQUARE, x, y}) {
    this.game = game;
    this.id = id;
    this.body = WallBody({game, points, x, y});
  }

  destroy() {
    this.game.world.destroyBody(this.body);
  }
}
