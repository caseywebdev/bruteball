var trim = function (n) {
  return Math.round(n * 100) / 100;
};

export default function (user) {
  var position = user.body.GetPosition();
  var velocity = user.body.GetLinearVelocity();
  var acceleration = user.acceleration;
  return [
    user.id,
    trim(position.get_x()),
    trim(position.get_y()),
    trim(velocity.get_x()),
    trim(velocity.get_y()),
    trim(acceleration.get_x()),
    trim(acceleration.get_y())
  ];
}
