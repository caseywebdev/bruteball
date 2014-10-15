import THREE from 'three';

export default function (user) {
  var rotation = (new THREE.Euler()).setFromRotationMatrix(user.matrix);
  return {
    id: user.info.id,
    x: user.ball.position[0],
    y: user.ball.position[1],
    vx: user.ball.velocity[0],
    vy: user.ball.velocity[1],
    ax: user.acceleration.x,
    ay: user.acceleration.y,
    rx: rotation.x,
    ry: rotation.y,
    rz: rotation.z
  };
}
