/** @jsx React.DOM */

import _ from 'underscore';
import CANNON from 'cannon';
import Cursors from 'cursors';
import React from 'react';
import THREE from 'three';
import demoMap from 'maps/demo';

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
    light.position.set(50,50,50);
    this.scene.add(light);

    var material = new THREE.MeshLambertMaterial({color: 0xffffff});
    var map = new THREE.Mesh(demoMap.geometry, material);
    this.scene.add(map);

    this.balls = {};

    this.camera.position.z = 20;
    this.camera.position.y = 10;
    this.camera.rotation.x = -0.5;

    this.renderMap();
  },

  renderMap: function () {
    _.each(this.state.users, this.renderUser);
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.renderMap);
  },

  renderUser: function (user) {
    var ball = this.balls[user.id];
    if (!ball) ball = this.balls[user.id] = this.createBall();
    ball.position.x = user.x * 0.1;
    ball.position.z = user.y * 0.1;
  },

  createBall: function () {
    var geometry = new THREE.SphereGeometry( 0.5, 32, 32 );
    var material = new THREE.MeshLambertMaterial( {color: 0xffff00} );
    var ball = new THREE.Mesh( geometry, material );
    ball.position.y = 5;
    this.scene.add(ball);
    return ball;
  },

  setUsers: function (users) {
    this.update({users: {$set: users}});
  },

  render: function () {
    return <div />;
  }
});
