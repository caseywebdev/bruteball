export default function (user) {
  var position = user.body.GetPosition();
  var velocity = user.body.GetLinearVelocity();
  var acceleration = user.acceleration;
  return [
    user.id,
    position.get_x(),
    position.get_y(),
    velocity.get_x(),
    velocity.get_y(),
    acceleration.get_x(),
    acceleration.get_y()
  ];
}
