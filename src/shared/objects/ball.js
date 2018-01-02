const {Body, Events, Vector} = require('matter-js');
const BallBody = require('../bodies/ball');
const config = require('../config');

const {accelerationScalar, fixedTimeStep, maxSpeed} = config.game;

module.exports = class {
  constructor({game, id, user, x, y}) {
    this.game = game;
    this.id = id;
    this.user = user;
    this.body = BallBody({game, x, y});
    this.acceleration = Vector.create(0, 0);
    Events.on(this.game.engine, 'beforeUpdate', this.handlePreStep);
  }

  handlePreStep = () => {
    const {
      acceleration: {x: ax, y: ay},
      body,
      body: {velocity: {x: vx, y: vy}}
    } = this;
    if (!ax && !ay) return;

    let velocity = Vector.create(
      vx + (ax * accelerationScalar * fixedTimeStep),
      vy + (ay * accelerationScalar * fixedTimeStep)
    );
    if (Vector.magnitude(velocity) > maxSpeed) {
      velocity = Vector.mult(Vector.normalise(velocity), maxSpeed);
    }
    Body.setVelocity(body, velocity);
  }

  setAcceleration({x, y}) {
    let v = Vector.create(x, y);
    if (Vector.magnitude(v) > 1) v = Vector.normalise(v);
    this.acceleration = v;
  }

  destroy() {
    Events.off(this.game.engine, 'beforeUpdate', this.handlePreStep);
    this.game.world.destroyBody(this.body);
  }
};

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
