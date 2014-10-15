/** @jsx React.DOM */

import App from 'client/components/app';
import Index from 'client/components/index';
import NotFound from 'client/components/not-found';
import React from 'react';
import {Routes, Route, DefaultRoute, NotFoundRoute} from 'react-router';

export default React.createClass({
  render: function () {
    return (
      <Routes location='history'>
        <Route name='app' path='/' handler={App}>
          <DefaultRoute name='index' handler={Index} />
          <NotFoundRoute handler={NotFound} />
        </Route>
      </Routes>
    );
  }
});
