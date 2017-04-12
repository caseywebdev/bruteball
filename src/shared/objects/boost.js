import BoostBody from '../bodies/boost';

export default class {
  constructor({game, id, x, y}) {
    this.game = game;
    this.id = id;
    this.body = BoostBody({game, x, y});
  }

  destroy() {
    this.game.world.destroyBody(this.body);
  }
}

// export var create = function (options) {
//   options = _.extend({}, options, {
//     x: options.x + 0.5,
//     y: options.y + 0.5
//   });
//   return {
//     type: 'boost',
//     id: ++options.game.incr,
//     game: options.game,
//     body: BoostBody.create(options),
//     mesh: config.node ? null : BoostMesh.create(options),
//     home: new b2.b2Vec2(options.x, options.y),
//     usedAt: -config.game.boostWait
//   };
// };
//
// export var isUsed = function (boost) {
//   return boost.game.step - boost.usedAt < config.game.boostWait;
// };
//
// export var preStep = function (boost) {
//   var position = isUsed(boost) ? config.game.hiddenPosition : boost.home;
//   boost.body.SetTransform(position, boost.body.GetAngle());
// };
//
// export var updateMesh = function (boost) {
//   var mesh = boost.mesh;
//   if (isUsed(boost)) {
//     mesh.material = BoostMesh.USED_MATERIAL;
//     mesh.castShadow = false;
//   } else {
//     mesh.material = BoostMesh.ACTIVE_MATERIAL;
//     mesh.castShadow = true;
//   }
// };
//
// export var use = function (boost, user) {
//   if (isUsed(boost)) return;
//   var velocity = user.body.GetLinearVelocity();
//   var speed = velocity.Normalize() + 15;
//   velocity.Set(velocity.get_x() * speed, velocity.get_y() * speed);
//   user.body.SetLinearVelocity(velocity);
//   boost.usedAt = boost.game.step;
//   boost.game.changed.push(boost, user);
// };
//
// export var applyFrame = function (game, b) {
//   var boost = _.find(game.objects, {type: 'boost', id: b[0]});
//   boost.usedAt = b[1];
// };
//
// export var destroy = function (boost) {
//   b2.destroy(boost.home);
//   boost.game.world.DestroyBody(boost.body);
//   if (!config.node) boost.game.scene.remove(boost.mesh);
// };
