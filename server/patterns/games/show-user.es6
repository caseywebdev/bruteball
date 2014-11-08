import round from 'shared/utils/round';

export default function (user) {
  var position = user.body.GetPosition();
  var velocity = user.body.GetLinearVelocity();
  var acceleration = user.acceleration;
  return [
    user.id,
    round(position.get_x(), 100),
    round(position.get_y(), 100),
    round(velocity.get_x(), 100),
    round(velocity.get_y(), 100),
    round(acceleration.get_x(), 100),
    round(acceleration.get_y(), 100)
  ];
}
