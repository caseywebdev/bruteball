const Ball = require('./ball');
const HatBody = require('../bodies/hat');

module.exports = class {
  constructor({game, id, x, y}) {
    this.game = game;
    this.id = id;
    this.body = HatBody({game, x, y});
  }

  handlePreStep = () => {
    this.body.setActive(!this.carrier);
  }

  handleContact(ball) {
    if (!this.carrier && ball instanceof Ball) this.carrier = ball;
  }

  destroy() {
    this.game.world.destroyBody(this.body);
  }
};
