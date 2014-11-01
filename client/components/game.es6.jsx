import _ from 'underscore';
import config from 'shared/config';
import Cursors from 'cursors';
import Game from 'shared/objects/game';
import React from 'react';
import THREE from 'three';

var MAP_SIZE = 32;

var RENDERER = new THREE.WebGLRenderer();
RENDERER.setSize(window.innerWidth, window.innerHeight);
RENDERER.shadowMapEnabled = true;
RENDERER.shadowMapCullFace = THREE.CullFaceBack;
RENDERER.shadowMapType = THREE.PCFSoftShadowMap;

var CAMERA = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);

var getMedian = function (array) {
  return _.sortBy(array)[Math.floor(array.length / 2)];
};

export default React.createClass({
  mixins: [Cursors],

  componentDidMount: function () {
    this.scene = this.props.game.scene;

    this.getDOMNode().appendChild(RENDERER.domElement);

    var light = new THREE.DirectionalLight(0xffffff, 0.9);
    light.position.set(MAP_SIZE / 2, MAP_SIZE / 2, 10);
    light.target.position.set(MAP_SIZE / 2 + 2, MAP_SIZE / 2 - 2, 0);
    light.castShadow = true;
    light.shadowCameraNear = 0;
    light.shadowCameraFar = MAP_SIZE;
    light.shadowCameraTop = MAP_SIZE;
    light.shadowCameraBottom = -MAP_SIZE;
    light.shadowCameraLeft = -MAP_SIZE;
    light.shadowCameraRight = MAP_SIZE;
    // light.shadowCameraVisible = true;
    light.shadowMapWidth = light.shadowMapHeight = 2048;

    this.scene.add(light);

    var plane = new THREE.PlaneGeometry(MAP_SIZE, MAP_SIZE);
    var material = new THREE.MeshLambertMaterial();
    var floor = new THREE.Mesh(plane, material);
    floor.receiveShadow = true;
    floor.position.set(MAP_SIZE / 2, MAP_SIZE / 2, 0);
    this.scene.add(floor);
    this.balls = {};

    this.handleResize();
    this.frames = [];
    this.lastFrame = Date.now();
    this.renderMap();
    window.addEventListener('resize', this.handleResize);
  },

  componentWillUnmount: function () {
    window.removeEventListener('resize', this.handleResize);
    cancelAnimationFrame(this.rafId);
    RENDERER.domElement.remove();
  },

  handleResize: function () {
    RENDERER.setSize(window.innerWidth, window.innerHeight);
    CAMERA.aspect = window.innerWidth / window.innerHeight;
    CAMERA.updateProjectionMatrix();
  },

  renderMap: function () {
    this.rafId = requestAnimationFrame(this.renderMap);
    var now = Date.now();
    this.frames = [now - this.lastFrame].concat(this.frames.slice(0, 59));
    this.lastFrame = now;
    this.update({fps: {$set: Math.ceil(1000 / getMedian(this.frames))}});
    _.each(this.props.game.objects, function (object) {
      var Type = require('shared/objects/' + object.type);
      if (Type.updateMesh) Type.updateMesh(object);
    });
    this.updateCamera();
    RENDERER.render(this.scene, CAMERA);
  },

  updateCamera: function () {
    var user = this.state.user;
    if (!user) return;
    user = Game.findObject(this.props.game, {type: 'user', id: user.id});
    if (!user) return;
    CAMERA.position.x += (user.mesh.position.x - CAMERA.position.x) * 0.1;
    CAMERA.position.y += (user.mesh.position.y - CAMERA.position.y) * 0.1;
    CAMERA.position.z = 15;
  },

  render: function () {
    return <div />;
  }
});
