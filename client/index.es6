//= require bower_components/amdainty/amdainty.js
//= require bower_components/threejs/build/three.js
//= requireSelf
//= require ./init.js

import FastClick from 'fastclick';
import Router from 'client/components/router';
import React from 'react';

var handleDomReady = function () {
  FastClick.attach(document.body);
  React.renderComponent(Router(), document.body);
};

if (document.readyState !== 'loading') handleDomReady();
else document.addEventListener('DOMContentLoaded', handleDomReady);
