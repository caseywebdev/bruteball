import trim from 'patterns/numbers/trim';

export default function (user) {
  var position = user.ball.body.GetPosition();
  var velocity = user.ball.body.GetLinearVelocity();
  var acceleration = user.acceleration;
  return [
    user.info.id,
    trim(position.get_x()),
    trim(position.get_y()),
    trim(velocity.get_x()),
    trim(velocity.get_y()),
    trim(acceleration.get_x()),
    trim(acceleration.get_y())
  ];
}
