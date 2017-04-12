import {Vec2} from 'planck-js';
import BallBody from '../bodies/ball';
import config from '../config';

const {accelerationScalar, fixedTimeStep} = config.game;

export default class {
  constructor({game, id, user, x, y}) {
    this.game = game;
    this.id = id;
    this.user = user;
    this.body = BallBody({game, x, y});
    this.acceleration = new Vec2(0, 0);
    this.game.world.on('pre-step', this.handlePreStep);
  }

  handlePreStep = () => {
    const {acceleration, body} = this;
    if (!acceleration.length()) return;

    const velocity = body.getLinearVelocity();
    const speed = velocity.length();
    velocity.set(
      velocity.x + (acceleration.x * accelerationScalar * fixedTimeStep),
      velocity.y + (acceleration.y * accelerationScalar * fixedTimeStep)
    );
    const maxSpeed = Math.max(config.game.maxSpeed, speed);
    if (velocity.length() > maxSpeed) {
      velocity.normalize();
      velocity.set(velocity.x * maxSpeed, velocity.y * maxSpeed);
    }
    body.setLinearVelocity(velocity);
  }

  setAcceleration({x, y}) {
    const {acceleration} = this;
    acceleration.set(x, y);
    if (acceleration.length() > 1) acceleration.normalize();
  }

  destroy() {
    this.game.world.off('pre-step', this.handlePreStep);
    this.game.world.destroyBody(this.body);
  }
}

// export var applyFrame = function (game, u, step) {
//   if (step !== game.step) return;
//   var id = u[0];
//   var user = Game.createObject(game, {type: 'user', id: id});
//   var position = user.body.GetPosition();
//   position.Set(u[1], u[2]);
//   user.body.SetTransform(position, user.body.GetAngle());
//   var velocity = user.body.GetLinearVelocity();
//   velocity.Set(u[3], u[4]);
//   user.body.SetLinearVelocity(velocity);
//   user.acceleration.Set(u[5], u[6]);
// };
//
// export var hit = function (a, b) {
//   var hat = _.find(a.game.objects, {type: 'hat'});
//   var hitter = hat.usedBy === a.id ? b : hat.usedBy === b.id ? a : null;
//   if (!hitter) return;
//   Hat.drop(hat);
//   Hat.use(hat, hitter);
// };
