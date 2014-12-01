import App from 'client/components/app';
import Index from 'client/components/index';
import NotFound from 'client/components/not-found';
import React from 'react';
import {Route, DefaultRoute, NotFoundRoute} from 'react-router';

var routes = (
  <Route name='app' path='/' handler={App}>
    <DefaultRoute name='index' handler={Index} />
    <NotFoundRoute handler={NotFound} />
  </Route>
);

export default routes;
