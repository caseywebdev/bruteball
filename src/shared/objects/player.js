import b2 from 'box2d.js';
import BallBody from '../bodies/ball';
import config from '../config';

var DT = config.game.dt;

export default class {
  constructor({game, x, y}) {
    this.game = game;
    this.body = BallBody({game, x, y});
    this.acceleration = new b2.b2Vec2(0, 0);
  }

  preStep() {
    const {acceleration, body} = this;
    if (!acceleration.Length()) return;

    const velocity = body.GetLinearVelocity();
    const speed = velocity.Length();
    const maxSpeed = Math.max(config.game.maxSpeed, speed);
    velocity.Set(
      velocity.get_x() + (acceleration.get_x() * config.game.acceleration * DT),
      velocity.get_y() + (acceleration.get_y() * config.game.acceleration * DT)
    );
    if (velocity.Length() > maxSpeed) {
      velocity.Normalize();
      velocity.Set(velocity.get_x() * maxSpeed, velocity.get_y() * maxSpeed);
    }
    body.SetLinearVelocity(velocity);
  }

  destroy() {
    b2.destroy(this.acceleration);
    this.game.world.DestroyBody(this.body);
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
