//= require bower_components/amdainty/amdainty.js
//= require ./meshes/**/*
//= require shared/**/*
//= requireSelf
//= require ./init.js

import FastClick from 'fastclick';
import Router from 'client/components/router';
import React from 'react';

var handleDomReady = function () {
  FastClick.attach(document.body);
  React.render(<Router />, document.body);
};

if (document.readyState !== 'loading') handleDomReady();
else document.addEventListener('DOMContentLoaded', handleDomReady);
