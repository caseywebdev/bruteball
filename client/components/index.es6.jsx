/** @jsx React.DOM */

import _ from 'underscore';
import Cursors from 'cursors';
import React from 'react';

export default React.createClass({
  mixins: [Cursors],

  getInitialState: function () {
    return {
      users: []
    };
  },

  componentDidMount: function () {
    this.state.live.on('users', this.setUsers);
  },

  setUsers: function (users) {
    this.update({users: {$set: users}});
  },

  renderUser: function (user, i) {
    return <div key={i}>{user.display_name}</div>;
  },

  render: function () {
    return (
      <div>
        Users:
        {_.map(this.state.users, this.renderUser)}
      </div>
    );
  }
});
