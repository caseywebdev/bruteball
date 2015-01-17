//= require bower_components/amdainty/amdainty.js
//= require ./meshes/**/*
//= require shared/**/*
//= requireSelf
//= require ./init.js

import FastClick from 'fastclick';
import React from 'react';
import ReactRouter from 'react-router';
import routes from 'client/routes';

var handleDomReady = function () {
  FastClick.attach(document.body);
  ReactRouter.run(routes, ReactRouter.HistoryLocation, function (Handler) {
    React.render(<Handler />, document.body);
  });
};

if (document.readyState !== 'loading') handleDomReady();
else document.addEventListener('DOMContentLoaded', handleDomReady);
