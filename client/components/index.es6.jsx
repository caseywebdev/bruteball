/** @jsx React.DOM */

import _ from 'underscore';
import Cursors from 'cursors';
import Demo from 'components/demo';
import React from 'react';

var MOVE_KEYS = {
  '38': 'up',
  '40': 'down',
  '37': 'left',
  '39': 'right'
};

export default React.createClass({
  mixins: [Cursors],

  getInitialState: function () {
    return {
      users: []
    };
  },

  componentDidMount: function () {
    this.state.live.on('users', this.setUsers);
    document.addEventListener('keydown', this.handleKey);
    document.addEventListener('keyup', this.handleKey);
  },

  handleKey: function (ev) {
    var move = MOVE_KEYS[ev.which];
    if (!move) return;
    this.state.live.send('move', {dir: move, state: ev.type === 'keydown'});
    ev.preventDefault();
  },

  setUsers: function (users) {
    this.update({users: {$set: users}});
  },

  render: function () {
    return (
      <div>
        <Demo cursors={{users: this.getCursor('users')}} />
      </div>
    );
  }
});
