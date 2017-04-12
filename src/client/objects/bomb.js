import Bomb from '../../shared/objects/bomb';
import BombMesh from '../meshes/bomb';

export default class extends Bomb {
  constructor(options) {
    super(options);
    const {x, y} = options;
    this.mesh = new BombMesh({x, y});
    this.game.scene.add(this.mesh);
  }

  updateMesh() {
    const {mesh} = this;
    if (this.isUsed()) {
      mesh.material = BombMesh.USED_MATERIAL;
      mesh.castShadow = false;
    } else {
      mesh.material = BombMesh.ACTIVE_MATERIAL;
      mesh.castShadow = true;
    }
  }

  destroy() {
    super.destroy();
    this.game.scene.remove(this.mesh);
  }
}
