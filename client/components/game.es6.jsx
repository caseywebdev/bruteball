/** @jsx React.DOM */

import _ from 'underscore';
import Cursors from 'cursors';
import React from 'react';
import THREE from 'three';
import demoMap from 'maps/demo';
import glowFragmentShader from 'shaders/fragment/glow';
import glowVertexShader from 'shaders/vertex/glow';

demoMap = THREE.JSONLoader.prototype.parse(demoMap);

export default React.createClass({
  mixins: [Cursors],

  componentDidMount: function () {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    var light = new THREE.PointLight(0xffffff, 1, 1000);
    light.position.set(50, 50, 50);
    this.scene.add(light);

    var material = new THREE.MeshLambertMaterial({color: 0xffffff});
    var map = new THREE.Mesh(demoMap.geometry, material);
    this.scene.add(map);
    map.rotation.x = Math.PI / 2;
    map.position.z = -3;
    this.balls = {};


    this.camera.position.z = 20;

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
    ball.position.x = user.x;
    ball.position.y = -user.y;
    if (this.state.user && user.id === this.state.user.id) {
      this.camera.position.x = ball.position.x;
      this.camera.position.y = ball.position.y;
    }
  },

  createBall: function () {
    var geometry = new THREE.SphereGeometry(1, 32, 32);
    var material = new THREE.MeshLambertMaterial({color: 0xff0000});
    var ball = new THREE.Mesh(geometry, material);
    ball.position.y = 5;
    this.scene.add(ball);
    var customMaterial = new THREE.ShaderMaterial( {
      uniforms: {
        c: {type: 'f', value: 1.0},
        p: {type: 'f', value: 1.4},
        glowColor: {type: 'c', value: new THREE.Color(0x00ff00)},
        viewVector: {type: 'v3', value: this.camera.position}
      },
      vertexShader: glowVertexShader,
      fragmentShader: glowFragmentShader,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    var moonGlow = new THREE.Mesh(geometry.clone(), customMaterial.clone());
    moonGlow.position.x = ball.position.x;
    moonGlow.position.y = ball.position.y;
    moonGlow.position.z = ball.position.z;
    moonGlow.scale.multiplyScalar(1.2);
    this.scene.add(moonGlow);
    return ball;
  },

  render: function () {
    return <div />;
  }
});
