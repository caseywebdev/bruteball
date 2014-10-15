/** @jsx React.DOM */

import Cursors from 'cursors';
import Header from 'client/components/header';
import Live from 'live';
import React from 'react';

export default React.createClass({
  mixins: [Cursors],

  getInitialState: function () {
    return {
      live: new Live(),
      user: null
    };
  },

  render: function () {
    var cursors = {live: this.getCursor('live'), user: this.getCursor('user')};
    return (
      <div>
        <Header cursors={cursors} />
        {this.props.activeRouteHandler({cursors: cursors})}
      </div>
    );
  }
});
