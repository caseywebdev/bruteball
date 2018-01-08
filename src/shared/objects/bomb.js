const _ = require('underscore');
const {Vec2} = require('planck-js');
const Ball = require('./ball');
const BombBody = require('../bodies/bomb');
const config = require('../config');

const BLAST_RADIUS = 5;
const POWER = 5;

module.exports = class {
  constructor({game, id, x, y}) {
    this.game = game;
    this.id = id;
    this.body = BombBody({game, x, y});
    this.game.world.on('pre-step', this.handlePreStep);
  }

  isUsed() {
    return this.game.stepCount - this.usedAt < config.game.bombWait;
  }

  handlePreStep = () => {
    this.body.setActive(!this.isUsed());
  }

  handleContact(ball) {
    if (this.isUsed() || !(ball instanceof Ball)) return;

    const epicenter = this.body.getPosition();
    const bombX = epicenter.x;
    const bombY = epicenter.y;
    this.usedAt = this.game.stepCount;
    _.each(this.game.objects, object => {
      if (!(object instanceof Ball)) return;

      const body = object.body;
      const position = body.getPosition();
      const delta = new Vec2(position.x - bombX, position.y - bombY);
      const distance = delta.normalize();
      if (distance > BLAST_RADIUS) return;

      const speed = (BLAST_RADIUS - distance) * POWER;
      const velocity = object.body.getLinearVelocity();
      velocity.set(
        velocity.x + (delta.x * speed),
        velocity.y + (delta.y * speed)
      );
      body.setLinearVelocity(velocity);
    });
  }

  destroy() {
    this.game.world.off('pre-step', this.handlePreStep);
    this.game.world.destroyBody(this.body);
  }
};
