import clamp from 'shared/utils/clamp';

export default function (user) {
  var position = user.body.GetPosition();
  var velocity = user.body.GetLinearVelocity();
  var acceleration = user.acceleration;
  return [
    user.id,
    clamp(position.get_x()),
    clamp(position.get_y()),
    clamp(velocity.get_x()),
    clamp(velocity.get_y()),
    clamp(acceleration.get_x()),
    clamp(acceleration.get_y())
  ];
}
