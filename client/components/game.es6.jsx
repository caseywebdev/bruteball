/** @jsx React.DOM */

import Cursors from 'cursors';
import Game from 'shared/entities/game';
import React from 'react';
import THREE from 'three';

var MAP_SIZE = 16;

export default React.createClass({
  mixins: [Cursors],

  componentDidMount: function () {
    this.scene = this.state.game.scene;
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMapEnabled = true;
    this.renderer.shadowMapCullFace = THREE.CullFaceBack;
    this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
    document.body.appendChild(this.renderer.domElement);

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
    var diffuse = THREE.ImageUtils.loadTexture('/textures/ground.jpg');
    var material = new THREE.MeshBasicMaterial({map: diffuse});
    var floor = new THREE.Mesh(plane, material);
    floor.receiveShadow = true;
    floor.position.set(MAP_SIZE / 2, MAP_SIZE / 2, 0);
    this.scene.add(floor);
    this.balls = {};

    this.handleResize();
    this.updateFps();
    this.renderMap();
    window.addEventListener('resize', this.handleResize);
  },

  componentWillUnmount: function () {
    window.removeEventListener('resize', this.handleResize);
  },

  handleResize: function () {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  },

  updateFps: function () {
    this.update({fps: {$set: this.frames || 0}});
    this.frames = 0;
    setTimeout(this.updateFps, 1000);
  },

  renderMap: function () {
    Game.step(this.state.game);
    this.updateCamera();
    this.renderer.render(this.scene, this.camera);
    ++this.frames;
    requestAnimationFrame(this.renderMap);
  },

  updateCamera: function () {
    var user = this.state.user && this.state.game.users[this.state.user.id];
    var mesh = user && user.ball.mesh;
    var camera = this.camera;
    if (mesh) {
      camera.position.x += (mesh.position.x - camera.position.x) * 0.1;
      camera.position.y += (mesh.position.y - 5 - camera.position.y) * 0.1;
      camera.position.z = 15;
      camera.lookAt(mesh.position);
    } else {
      camera.position.x = MAP_SIZE / 2;
      camera.position.y = MAP_SIZE / 2 - 5;
      camera.position.z = 25;
      camera.lookAt(new THREE.Vector3(MAP_SIZE / 2, MAP_SIZE / 2, 0));
    }
  },

  render: function () {
    return <div />;
  }
});
