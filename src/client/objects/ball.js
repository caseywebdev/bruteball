import {Euler, Matrix4, Vector3} from 'three';
import Ball from '../../shared/objects/ball';
import BallMesh from '../meshes/ball';
import config from '../config';

const UP = new Vector3(0, 0, 1);

export default class extends Ball {
  constructor(options) {
    super(options);
    const {x, y} = options;
    this.mesh = new BallMesh({x, y});
    this.game.scene.add(this.mesh);
  }

  updateMesh() {
    const position = this.body.getPosition();
    const {mesh} = this;
    const delta = mesh.position.clone();
    mesh.position.x = position.x;
    mesh.position.y = position.y;
    delta.sub(mesh.position);
    const theta = delta.length() / config.game.ballRadius;
    if (!theta) return;

    const axis = delta.cross(UP).normalize();
    mesh.matrix =
      (new Matrix4()).makeRotationAxis(axis, theta).multiply(mesh.matrix);
    mesh.rotation.copy((new Euler()).setFromRotationMatrix(mesh.matrix));
  }

  destroy() {
    super.destroy();
    this.game.scene.remove(this.mesh);
  }
}
