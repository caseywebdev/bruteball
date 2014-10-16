import THREE from 'three';
import trim from 'patterns/numbers/trim';

export default function (user) {
  var position = user.ball.GetPosition();
  var velocity = user.ball.GetLinearVelocity();
  var acceleration = user.acceleration;
  var rotation = (new THREE.Euler()).setFromRotationMatrix(user.matrix);
  return {
    id: user.info.id,
    x: trim(position.get_x()),
    y: trim(position.get_y()),
    vx: trim(velocity.get_x()),
    vy: trim(velocity.get_y()),
    ax: trim(acceleration.x),
    ay: trim(acceleration.y),
    rx: trim(rotation.x),
    ry: trim(rotation.y),
    rz: trim(rotation.z)
  };
}
