//= require bower_components/amdainty/amdainty.js
//= require ./meshes/**/*
//= require src/shared/**/*
//= requireself
//= require ./init.js

import FastClick from 'fastclick';
import React from 'react';
import ReactRouter from 'react-router';
import routes from 'client/routes';

FastClick.attach(document.body);

if (__DEV__) {
  var script = document.createElement('script');
  script.src = 'http://localhost:35729/livereload.js';
  script.async = true;
  document.body.appendChild(script);
}

ReactRouter.run(routes, ReactRouter.HistoryLocation, function (Handler) {
  React.render(<Handler />, document.getElementById('main'));
});
