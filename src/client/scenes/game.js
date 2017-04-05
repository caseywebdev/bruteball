import _ from 'underscore';
import THREE from 'three';
import arenaLight from '../lights/arena';
import BallMesh from '../meshes/ball';
import camera from '../cameras/main';
import FloorMesh from '../meshes/floor';
import worldLight from '../lights/world';
import now from '../../shared/utils/now';
import renderer from '../renderers/main';

export default class {
  constructor({game}) {
    this.game = game;
    this.scene = new THREE.Scene();
    this.scene.add(worldLight);
    this.scene.add(arenaLight);
    this.scene.add(FloorMesh());
    this.ball = BallMesh();
    this.scene.add(this.ball);
    this.render = ::this.render;
    this.fps = Infinity;
    this.render(now());
  }

  render(t) {
    this.rafId = requestAnimationFrame(this.render);
    this.frames = [t - this.lastFrame].concat(this.frames.slice(0, 59));
    this.lastFrame = t;
    this.update({fps: {$set: Math.ceil(1000 / getMedian(this.frames))}});
    _.each(this.props.game.objects, function (object) {
      var Type = require('shared/objects/' + object.type);
      if (Type.updateMesh) Type.updateMesh(object);
    });
    this.updateCamera();
    renderer.render(this.el, camera);
  }

  updateCamera() {
    var user = this.state.user;
    if (!user) return;
    user = _.find(this.props.game.objects, {type: 'user', id: user.id});
    if (!user) return;
    camera.position.x = user.mesh.position.x;
    camera.position.y = user.mesh.position.y;
    camera.position.z = 25;
  }

  destroy() {
    cancelAnimationFrame(this.rafId);
  }
}

// var MAP_SIZE = 32;

var getMedian = function (array) {
  return _.sortBy(array)[Math.floor(array.length / 2)];
};

// export default React.createClass({
//   componentDidMount: function () {
//     this.scene = this.props.game.scene;
//
//     this.getDOMNode().appendChild(RENDERER.domElement);
//
//     var light = new THREE.DirectionalLight(0xffffff, 0.9);
//     light.position.set(MAP_SIZE / 2, MAP_SIZE / 2, 10);
//     light.target.position.set(MAP_SIZE / 2 + 2, MAP_SIZE / 2 - 2, 0);
//     light.castShadow = true;
//     light.shadowCameraNear = 0;
//     light.shadowCameraFar = MAP_SIZE;
//     light.shadowCameraTop = MAP_SIZE;
//     light.shadowCameraBottom = -MAP_SIZE;
//     light.shadowCameraLeft = -MAP_SIZE;
//     light.shadowCameraRight = MAP_SIZE;
//     // light.shadowCameraVisible = true;
//     light.shadowMapWidth = light.shadowMapHeight = 2048;
//
//     this.scene.add(light);
//     light.target.updateMatrixWorld();
//
//     var plane = new THREE.PlaneBufferGeometry(MAP_SIZE, MAP_SIZE);
//     var material = new THREE.MeshLambertMaterial();
//     var floor = new THREE.Mesh(plane, material);
//     floor.receiveShadow = true;
//     floor.position.set(MAP_SIZE / 2, MAP_SIZE / 2, 0);
//     this.scene.add(floor);
//     this.balls = {};
//
//     this.handleResize();
//     this.frames = [];
//     this.lastFrame = Date.now();
//     this.renderMap(Date.now());
//     window.addEventListener('resize', this.handleResize);
//   },
//
//   renderMap: function (now) {
//     this.rafId = requestAnimationFrame(this.renderMap);
//     this.frames = [now - this.lastFrame].concat(this.frames.slice(0, 59));
//     this.lastFrame = now;
//     this.update({fps: {$set: Math.ceil(1000 / getMedian(this.frames))}});
//     Game.step(this.props.game);
//     _.each(this.props.game.objects, function (object) {
//       var Type = require('shared/objects/' + object.type);
//       if (Type.updateMesh) Type.updateMesh(object);
//     });
//     this.updateCamera();
//     renderer.render(this.el, camera);
//   },
//
//   updateCamera: function () {
//     var user = this.state.user;
//     if (!user) return;
//     user = _.find(this.props.game.objects, {type: 'user', id: user.id});
//     if (!user) return;
//     CAMERA.position.x = user.mesh.position.x;
//     CAMERA.position.y = user.mesh.position.y;
//     CAMERA.position.z = 25;
//   },
