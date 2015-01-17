//= require bower_components/amdainty/amdainty.js
//= require ./meshes/**/*
//= require shared/**/*
//= requireSelf
//= require ./init.js

import FastClick from 'fastclick';
import React from 'react';
import ReactRouter from 'react-router';
import routes from 'client/routes';

var injectLiveReload = function () {
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  script.src = 'http://localhost:35729/livereload.js';
  script.async = true;
  head.appendChild(script);
};

var handleDomReady = function () {
  injectLiveReload();
  FastClick.attach(document.body);
  ReactRouter.run(routes, ReactRouter.HistoryLocation, function (Handler) {
    React.render(<Handler />, document.body);
  });
};

if (document.readyState !== 'loading') handleDomReady();
else document.addEventListener('DOMContentLoaded', handleDomReady);
