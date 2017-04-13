import Ball from './ball';
import BoostBody from '../bodies/boost';
import config from '../config';

const POWER = 15;

export default class {
  constructor({game, id, x, y}) {
    this.game = game;
    this.id = id;
    this.body = BoostBody({game, x, y});
    this.game.world.on('pre-step', this.handlePreStep);
  }

  isUsed() {
    return this.game.stepCount - this.usedAt < config.game.boostWait;
  }

  handlePreStep = () => {
    this.body.setActive(!this.isUsed());
  }

  handleContact(ball) {
    if (this.isUsed() || !(ball instanceof Ball)) return;

    const velocity = ball.body.getLinearVelocity();
    const speed = velocity.normalize() + POWER;
    velocity.set(velocity.x * speed, velocity.y * speed);
    ball.body.setLinearVelocity(velocity);
    this.usedAt = this.game.stepCount;
  }

  destroy() {
    this.game.world.off('pre-step', this.handlePreStep);
    this.game.world.destroyBody(this.body);
  }
}
