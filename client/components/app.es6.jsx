import Cursors from 'cursors';
import Header from 'client/components/header';
import io from 'socket.io';
import React from 'react';

import {RouteHandler} from 'react-router';

export default React.createClass({
  mixins: [Cursors],

  getInitialState: function () {
    return {
      socket: io(),
      user: null
    };
  },

  render: function () {
    var cursors = {
      socket: this.getCursor('socket'),
      user: this.getCursor('user')
    };
    return (
      <div>
        <Header cursors={cursors} />
        <RouteHandler cursors={cursors} />
      </div>
    );
  }
});
