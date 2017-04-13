import Boost from '../../shared/objects/boost';
import BoostMesh from '../meshes/boost';

export default class extends Boost {
  constructor(options) {
    super(options);
    const {x, y} = options;
    this.mesh = new BoostMesh({x, y});
    this.game.scene.add(this.mesh);
  }

  updateMesh() {
    const {mesh} = this;
    if (this.isUsed()) {
      mesh.material = BoostMesh.USED_MATERIAL;
      mesh.castShadow = false;
    } else {
      mesh.material = BoostMesh.ACTIVE_MATERIAL;
      mesh.castShadow = true;
    }
  }

  destroy() {
    super.destroy();
    this.game.scene.remove(this.mesh);
  }
}
