/** @jsx React.DOM */

import _ from 'underscore';
import Cursors from 'cursors';
import React from 'react';
import THREE from 'three';

var MAP_SIZE = 16;

export default React.createClass({
  mixins: [Cursors],

  componentDidMount: function () {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMapEnabled = true;
    this.renderer.shadowMapCullFace = THREE.CullFaceBack;
    this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
    document.body.appendChild(this.renderer.domElement);

    var light = new THREE.DirectionalLight(0xffffff, 0.9);
    light.position.set(MAP_SIZE / 2, -MAP_SIZE / 2, 10);
    light.target.position.set(MAP_SIZE / 2, -MAP_SIZE / 2, 0);
    light.castShadow = true;
    light.shadowCameraNear = 0;
    light.shadowCameraFar = 10;
    light.shadowCameraTop = MAP_SIZE / 2;
    light.shadowCameraBottom = -MAP_SIZE / 2;
    light.shadowCameraLeft = -MAP_SIZE / 2;
    light.shadowCameraRight = MAP_SIZE / 2;
    // light.shadowCameraVisible = true;
    light.shadowMapWidth = light.shadowMapHeight = 2048;

    this.scene.add(light);

    var plane = new THREE.PlaneGeometry(MAP_SIZE, MAP_SIZE);
    var diffuse = THREE.ImageUtils.loadTexture('/textures/ground-diffuse.jpg');
    var material = new THREE.MeshPhongMaterial({
      map: diffuse
    });
    var floor = new THREE.Mesh(plane, material);
    floor.receiveShadow = true;
    floor.position.set(MAP_SIZE / 2, -MAP_SIZE / 2, 0);
    this.scene.add(floor);
    this.balls = {};

    this.camera.position.z = 15;

    this.handleResize();
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

  renderMap: function () {
    _.each(
      _.omit(this.balls, _.map(_.map(this.state.game.users, 'info'), 'id')),
      this.scene.remove,
      this.scene
    );
    _.each(this.state.game.users, this.renderUser);
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.renderMap);
  },

  renderUser: function (user) {
    var id = user.info.id;
    var ball = this.balls[id];
    if (!ball) this.scene.add(ball = this.balls[id] = user.ball.mesh);
    if (this.state.user && id === this.state.user.id) {
      this.camera.position.x +=
        (ball.position.x - this.camera.position.x) * 0.1;
      this.camera.position.y +=
        (ball.position.y - 5 - this.camera.position.y) * 0.1;
      this.camera.lookAt(ball.position);
    }
  },

  render: function () {
    return <div />;
  }
});
