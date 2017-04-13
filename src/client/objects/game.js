import _ from 'underscore';
import {
  DirectionalLight,
  HemisphereLight,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer
} from 'three';
import FloorMesh from '../meshes/floor';
import Game from '../../shared/objects/game';
import ClientWall from './wall';
import ClientBomb from './bomb';
import ClientBoost from './boost';
// import ClientHat from './hat';
import Ball from '../../shared/objects/ball';
import Bomb from '../../shared/objects/bomb';
import Wall from '../../shared/objects/wall';
import Boost from '../../shared/objects/boost';
// import Hat from '../../shared/objects/hat';

class ArenaLight extends DirectionalLight {
  constructor() {
    super(0xffffff, 0.9);
    const arenaSize = 32;
    const shadowMapSize = 2048;
    this.position.set(arenaSize / 2, arenaSize / 2, 10);
    this.target.position.set(arenaSize / 2 + 2, arenaSize / 2 - 2, 0);
    this.castShadow = true;
    this.shadow.camera.near = 0;
    this.shadow.camera.far = arenaSize;
    this.shadow.camera.top = arenaSize;
    this.shadow.camera.bottom = -arenaSize;
    this.shadow.camera.left = -arenaSize;
    this.shadow.camera.right = arenaSize;
    // this.shadow.camera.visible = true;
    this.shadow.mapSize.width = this.shadow.mapSize.height = shadowMapSize;
  }
}

class WorldLight extends HemisphereLight {
  constructor() {
    super(0xffffff, 0x333333, 0.5);
  }
}

class Camera extends PerspectiveCamera {
  constructor() {
    super(45, 1, 0.1, 1000);
    this.up = new Vector3(0, 0, 1);
    this.handleResize = ::this.handleResize;
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  handleResize() {
    this.aspect = window.innerWidth / window.innerHeight;
    this.updateProjectionMatrix();
  }

  destroy() {
    window.removeEventListener('resize', this.handleResize);
  }
}

class Renderer extends WebGLRenderer {
  constructor() {
    super({antialias: true});
    this.domElement.style.display = 'block';
    this.shadowMap.renderReverseSided = false;
    this.shadowMap.enabled = true;
    this.shadowMap.type = PCFSoftShadowMap;
    this.handleResize = ::this.handleResize;
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  handleResize() {
    this.setSize(window.innerWidth, window.innerHeight);
  }

  destroy() {
    window.removeEventListener('resize', this.handleResize);
  }
}

const CLASS_MAP = new Map();
CLASS_MAP.set(Wall, ClientWall);
CLASS_MAP.set(Bomb, ClientBomb);
CLASS_MAP.set(Boost, ClientBoost);

export default class extends Game {
  createScene() {
    this.scene = new Scene();
    this.scene.add(new WorldLight());
    const light = new ArenaLight();
    this.scene.add(light);
    light.target.updateMatrixWorld();
    this.scene.add(new FloorMesh());
    this.fps = 0;
    this.camera = new Camera();
    this.camera.position.z = 25;
    this.camera.position.x = 16;
    this.camera.position.y = 16;
    this.renderer = new Renderer();
    this.render = ::this.render;
    this.render();
  }

  createObject(klass, options) {
    klass = CLASS_MAP.get(klass) || klass;
    return super.createObject(klass, options);
  }

  render(t) {
    this.rafId = requestAnimationFrame(this.render);
    if (t) this.fps = 1000 / (t - this.lastTick);
    this.lastTick = t;
    _.invoke(this.objects, 'updateMesh');
    this.updateCamera();
    this.renderer.render(this.scene, this.camera);
  }

  updateCamera() {
    const ball = _.find(this.objects, obj => obj instanceof Ball);
    if (ball) {
      this.camera.position.x = ball.mesh.position.x;
      this.camera.position.y = ball.mesh.position.y;
    }
  }

  destroy() {
    super.destroy();
    cancelAnimationFrame(this.rafId);
    this.camera.destroy();
    this.renderer.destroy();
  }
}
