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

var PING_DELAY = 1000;

export default React.createClass({
  mixins: [Cursors],

  getInitialState: function () {
    return {
      game: Game.create(),
      latency: 0
    };
  },

  componentDidMount: function () {
    this.state.live.on('g', this.setGame);
    this.state.live.on('u', this.handleUserUpdate);
    this.state.live.on('r', this.removeUser);
    this.ping();
    document.addEventListener('keydown', this.handleKey);
    document.addEventListener('keyup', this.handleKey);
  },

  componentWillUnmount: function () {
    this.state.live.off('g', this.setGame);
    this.state.live.off('u', this.handleUserUpdate);
    this.state.live.off('r', this.removeUser);
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

  ping: function () {
    this.lastPing = Date.now();
    this.state.live.send('ping', this.lastPing, this.handlePing);
    this.pingTimeoutId = _.delay(this.ping, PING_DELAY);
  },

  handlePing: function () {
    this.update({latency: {$set: Math.ceil((Date.now() - this.lastPing) / 2)}});
  },

  getAv: function () {
    return _.reduce(_.filter(KEYS, {down: true}), function (av, key) {
      return {x: av.x + key.x, y: av.y + key.y};
    }, {x: 0, y: 0});
  },

  setGame: function (g) {
    Game.step(this.state.game);
    _.each(g.u, this.updateUser);
  },

  handleUserUpdate: function (u) {
    Game.step(this.state.game);
    this.updateUser(u);
  },

  updateUser: function (u) {
    var game = this.state.game;
    if (!game.users[u.id]) Game.addUser(game, {id: u.id});
    var user = game.users[u.id];
    var position = user.ball.GetPosition();
    var cx = position.get_x();
    var cy = position.get_y();
    var dx = u.x - cx;
    var dy = u.y - cy;
    position.Set(
      Math.abs(dx) > 1 ? u.x : cx + (dx * 0.1),
      Math.abs(dy) > 1 ? u.y : cy + (dy * 0.1)
    );
    user.ball.SetTransform(position, user.ball.GetAngle());
    var velocity = user.ball.GetLinearVelocity();
    velocity.Set(u.vx || 0, u.vy || 0);
    user.ball.SetLinearVelocity(velocity);
    user.acceleration.set(u.ax || 0, u.ay || 0);
  },

  removeUser: function (u) {
    Game.removeUser(this.state.game, {id: u.id});
  },

  render: function () {
    return (
      <div>
        <div className='latency'>Latency: {this.state.latency}ms</div>
        <GameComponent cursors={{
          game: this.getCursor('game'),
          user: this.getCursor('user')
        }} />
      </div>
    );
  }
});
