import Hat from '../../shared/objects/hat';
import HatMesh from '../meshes/hat';

export default class extends Hat {
  constructor(options) {
    super(options);
    const {x, y} = options;
    this.mesh = new HatMesh({x, y});
    this.game.scene.add(this.mesh);
  }

  updateMesh() {
    const {mesh} = this;
    const {body} = this.carrier || this;
    const position = body.getPosition();
    mesh.position.x = position.x;
    mesh.position.y = position.y;
  }

  destroy() {
    super.destroy();
    this.game.scene.remove(this.mesh);
  }
}
