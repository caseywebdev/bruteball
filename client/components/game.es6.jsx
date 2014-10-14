/** @jsx React.DOM */

import _ from 'underscore';
import Cursors from 'cursors';
import React from 'react';
import THREE from 'three';
import glowFragmentShader from 'shaders/fragment/glow';
import glowVertexShader from 'shaders/vertex/glow';

export default React.createClass({
  mixins: [Cursors],

  componentDidMount: function () {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMapEnabled = true;
    this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
    document.body.appendChild(this.renderer.domElement);

    var light = new THREE.SpotLight(0xffffff, 1, 1000, Math.PI / 2, 1);
    light.target.position.set(0, 0, 50);
    light.position.set(0, 10, 100);
    light.castShadow = true;
    this.scene.add(light);

    var plane = new THREE.PlaneGeometry(100, 100);
    var diffuse = THREE.ImageUtils.loadTexture('/textures/ball/diffuse.jpg');
    diffuse.repeat.x = diffuse.repeat.y = 4;
    diffuse.wrapT = diffuse.wrapS = THREE.RepeatWrapping;
    var material = new THREE.MeshPhongMaterial({map: diffuse});
    var floor = new THREE.Mesh(plane, material);
    floor.receiveShadow = true;
    this.scene.add(floor);
    this.balls = {};

    this.camera.position.z = 10;

    this.renderMap();
  },

  renderMap: function () {
    _.each(this.state.game.u, this.renderUser);
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.renderMap);
  },

  renderUser: function (user) {
    var ball = this.balls[user.id];
    if (!ball) ball = this.balls[user.id] = this.createBall();
    ball.position.set(user.x, -user.y, ball.position.z);
    ball.rotation.set(user.rx, user.ry, user.rz);
    if (this.state.user && user.id === this.state.user.id) {
      this.camera.position.x = ball.position.x;
      this.camera.position.y = ball.position.y;
      this.camera.lookAt(ball.position);
    }
  },

  createBall: function () {
    var geometry = new THREE.SphereGeometry(0.5, 32, 32);
    var specular = THREE.ImageUtils.loadTexture('/textures/ball/specular.jpg');
    var diffuse = THREE.ImageUtils.loadTexture('/textures/ball/diffuse.jpg');
    var bump = THREE.ImageUtils.loadTexture('/textures/ball/bump.jpg');

    bump.repeat.x = bump.repeat.y = 4;
    bump.wrapT = bump.wrapS = THREE.RepeatWrapping;
    var color = Math.random() < 0.5 ? 0xff0000 : 0x0000ff;
    var material = new THREE.MeshPhongMaterial({
      color: color,
      ambient: color,
      map: diffuse,
      specularMap: specular,
      specular: 0xffffff,
      shininess: 30,
      bumpMap: bump,
      bumpScale: 0.01,
      perPixel: true
    });
    var ball = new THREE.Mesh(geometry, material);
    ball.position.z = 0.5;
    ball.castShadow = true;
    ball.receiveShadow = true;
    this.scene.add(ball);
    // var customMaterial = new THREE.ShaderMaterial({
    //   uniforms: {
    //     c: {type: 'f', value: 1.0},
    //     p: {type: 'f', value: 1.4},
    //     glowColor: {type: 'c', value: new THREE.Color(0x00ff00)},
    //     viewVector: {type: 'v3', value: this.camera.position}
    //   },
    //   vertexShader: glowVertexShader,
    //   fragmentShader: glowFragmentShader,
    //   side: THREE.FrontSide,
    //   blending: THREE.AdditiveBlending,
    //   transparent: true
    // });
    // var moonGlow = new THREE.Mesh(geometry.clone(), customMaterial.clone());
    // moonGlow.position.x = ball.position.x;
    // moonGlow.position.y = ball.position.y;
    // moonGlow.position.z = ball.position.z;
    // moonGlow.scale.multiplyScalar(1.2);
    // this.scene.add(moonGlow);
    return ball;
  },

  render: function () {
    return <div />;
  }
});
