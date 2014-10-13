/** @jsx React.DOM */

import _ from 'underscore';
import Cursors from 'cursors';
import Game from 'components/game';
import React from 'react';

var keys = {
  '38': {down: false, x: 0, y: -1},
  '40': {down: false, x: 0, y: 1},
  '37': {down: false, x: -1, y: 0},
  '39': {down: false, x: 1, y: 0}
};

export default React.createClass({
  mixins: [Cursors],

  getInitialState: function () {
    return {
      game: {}
    };
  },

  componentDidMount: function () {
    this.state.live.on('game', this.setGame);
    document.addEventListener('keydown', this.handleKey);
    document.addEventListener('keyup', this.handleKey);
  },

  componentWillUnmount: function () {
    this.state.live.off('game', this.setGame);
    document.removeEventListener('keydown', this.handleKey);
    document.removeEventListener('keydown', this.handleKey);
  },

  handleKey: function (ev) {
    var key = keys[ev.which];
    if (!key) return;
    key.down = ev.type === 'keydown';
    this.sendAv();
    ev.preventDefault();
  },

  sendAv: function () {
    this.state.live.send('set-av', this.getAv());
  },

  getAv: function () {
    return _.reduce(_.filter(keys, {down: true}), function (av, key) {
      return {x: av.x + key.x, y: av.y + key.y};
    }, {x: 0, y: 0});
  },

  setGame: function (game) {
    this.update({game: {$set: game}});
  },

  render: function () {
    return (
      <div>
        <Game cursors={{
          game: this.getCursor('game'),
          user: this.getCursor('user')
        }} />
      </div>
    );
  }
});
