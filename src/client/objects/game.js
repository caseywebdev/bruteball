import _ from 'underscore';
import FloorMesh from '../meshes/floor';
import Game from '../../shared/objects/game';
import THREE from 'three';

class ArenaLight extends THREE.DirectionalLight {
  constructor() {
    super(0xffffff, 0.9);
    const arenaSize = 128;
    const shadowMapSize = 4096;
    this.position.set(-arenaSize / 4, arenaSize / 2, -arenaSize / 4);
    this.castShadow = true;
    this.shadowCameraNear = 0;
    this.shadowCameraFar = arenaSize;
    this.shadowCameraTop = arenaSize;
    this.shadowCameraBottom = -arenaSize;
    this.shadowCameraLeft = -arenaSize;
    this.shadowCameraRight = arenaSize;
    // this.shadowCameraVisible = true;
    this.shadowMapWidth = this.shadowMapHeight = shadowMapSize;
  }
}

class WorldLight extends THREE.HemisphereLight {
  constructor() {
    super(0xffffff, 0x333333, 0.5);
  }
}

class Camera extends THREE.PerspectiveCamera {
  constructor() {
    super(45, 1, 0.1, 1000);
    this.up = new THREE.Vector3(0, 0, 1);
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

class Renderer extends THREE.WebGLRenderer {
  constructor() {
    super();
    this.domElement.style.display = 'block';
    this.shadowMap.cullFace = THREE.CullFaceBack;
    this.shadowMap.enabled = true;
    this.shadowMap.type = THREE.PCFSoftShadowMap;
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

export default class extends Game {
  constructor(options) {
    super(options);
    this.scene = new THREE.Scene();
    this.scene.add(new WorldLight());
    this.scene.add(new ArenaLight());
    this.scene.add(FloorMesh());
    this.fps = Infinity;
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.render = ::this.render;
    this.render();
  }

  render(t) {
    this.rafId = requestAnimationFrame(this.render);
    if (t) this.fps = t - this.lastTick;
    this.lastTick = t;
    _.invoke(this.objects, 'updateMesh');
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    super.destroy();
    cancelAnimationFrame(this.rafId);
    this.camera.destroy();
    this.renderer.destroy();
  }
}
