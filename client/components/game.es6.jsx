/** @jsx React.DOM */

import _ from 'underscore';
import CelShader from 'client/shaders/cel';
import Cursors from 'cursors';
import Game from 'shared/entities/game';
import React from 'react';
import THREE from 'three';

var MAP_SIZE = 16;

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
    var diffuse = THREE.ImageUtils.loadTexture('/textures/ground.jpg');
    var material = new THREE.MeshBasicMaterial({map: diffuse});
    // var uniforms = THREE.UniformsUtils.clone(CelShader.uniforms);
    // uniforms.uBaseColor.value = new THREE.Color(0x00ff00);
    // var material = new THREE.ShaderMaterial(_.extend({}, CelShader, {
    //   uniforms: uniforms
    // }));
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
    var now = Date.now();
    this.frames = [now - this.lastFrame].concat(this.frames.slice(0, 59));
    this.lastFrame = now;
    this.update({fps: {$set: Math.ceil(1000 / getMedian(this.frames))}});
    this.rafId = requestAnimationFrame(this.renderMap);
    Game.step(this.props.game);
    this.updateCamera();
    RENDERER.render(this.scene, CAMERA);
  },

  updateCamera: function () {
    var user = this.state.user && this.props.game.users[this.state.user.id];
    var mesh = user && user.ball.mesh;
    if (!mesh) return;
    CAMERA.position.x += (mesh.position.x - CAMERA.position.x) * 0.1;
    CAMERA.position.y += (mesh.position.y - 5 - CAMERA.position.y) * 0.1;
    CAMERA.position.z = 15;
    CAMERA.lookAt(mesh.position);
  },

  render: function () {
    return <div />;
  }
});
