import Wall from '../../shared/objects/wall';
import WallMesh from '../meshes/wall';

export default class extends Wall {
  constructor(options) {
    super(options);
    const {points = Wall.SQUARE, x, y} = options;
    this.mesh = new WallMesh({points, x, y});
    this.game.scene.add(this.mesh);
  }

  updateMesh() {
    const {angle, position} = this.body;
    const {mesh} = this;
    mesh.position.x = position.x;
    mesh.position.y = position.y;
    mesh.rotation.z = angle;
  }

  destroy() {
    super.destroy();
    this.game.scene.remove(this.mesh);
  }
}
