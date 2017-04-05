import Wall from '../../shared/objects/wall';
import WallMesh from '../meshes/wall';

export default class extends Wall {
  constructor(options) {
    super(options);
    const {points = Wall.SQAURE, x, y} = options;
    this.mesh = new WallMesh({points, x, y});
    this.game.scene.add(this.mesh);
  }

  destroy() {
    super.destroy();
    this.game.scene.remove(this.mesh);
  }
}
