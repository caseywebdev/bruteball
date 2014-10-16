/** @jsx React.DOM */

import _ from 'underscore';
import Cursors from 'cursors';
import Game from 'entities/game';
import GameComponent from 'client/components/game';
import React from 'react';

var KEYS = {
  '38': {down: false, x: 0, y: -1},
  '40': {down: false, x: 0, y: 1},
  '37': {down: false, x: -1, y: 0},
  '39': {down: false, x: 1, y: 0}
};

export default React.createClass({
  mixins: [Cursors],

  getInitialState: function () {
    return {
      game: Game.create()
    };
  },

  componentDidMount: function () {
    this.state.live.on('g', this.setGame);
    document.addEventListener('keydown', this.handleKey);
    document.addEventListener('keyup', this.handleKey);
  },

  componentWillUnmount: function () {
    this.state.live.off('g', this.setGame);
    document.removeEventListener('keydown', this.handleKey);
    document.removeEventListener('keyup', this.handleKey);
  },

  handleKey: function (ev) {
    var key = KEYS[ev.which];
    var state = ev.type === 'keydown';
    if (!key || key.down === state) return;
    key.down = state;
    this.sendAv();
    ev.preventDefault();
  },

  sendAv: function () {
    this.state.live.send('set-av', this.getAv());
  },

  getAv: function () {
    return _.reduce(_.filter(KEYS, {down: true}), function (av, key) {
      return {x: av.x + key.x, y: av.y + key.y};
    }, {x: 0, y: 0});
  },

  setGame: function (g) {
    var game = this.state.game;
    _.each(g.u, function (u) {
      if (!game.users[u.id]) Game.addUser(game, {id: u.id});
      var user = game.users[u.id];
      var position = user.ball.GetPosition();
      position.set_x(u.x || 0);
      position.set_y(u.y || 0);
      user.ball.SetTransform(position, user.ball.GetAngle());
      var velocity = user.ball.GetLinearVelocity();
      velocity.set_x(u.vx || 0);
      velocity.set_y(u.vy || 0);
      user.ball.SetLinearVelocity(velocity);
      user.acceleration.x = u.ax || 0;
      user.acceleration.y = u.ay || 0;
    });
    game.lastStep = Date.now();
  },

  render: function () {
    return (
      <div>
        <GameComponent cursors={{
          game: this.getCursor('game'),
          user: this.getCursor('user')
        }} />
      </div>
    );
  }
});
