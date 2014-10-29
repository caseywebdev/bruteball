/** @jsx React.DOM */

import _ from 'underscore';
import config from 'shared/config';
import Cursors from 'cursors';
import Game from 'shared/objects/game';
import GameComponent from 'client/components/game';
import React from 'react';

var KEYS = {
  '38': {down: false, x: 0, y: 1},
  '40': {down: false, x: 0, y: -1},
  '37': {down: false, x: -1, y: 0},
  '39': {down: false, x: 1, y: 0}
};

var PING_WAIT = 1000;
var PINGS_TO_HOLD = 10;
var LOSSES_TO_HOLD = 100;
var MAX_TARDINESS = 1000 / config.game.broadcastsPerSecond / 2;

export default React.createClass({
  mixins: [Cursors],

  getInitialState: function () {
    return {
      fps: 0,
      pings: [],
      losses: []
    };
  },

  componentDidMount: function () {
    this.ping();
    this.state.live.on({
      'new-game': this.handleNewGame,
      g: this.handleGame,
      'remove-user': this.removeUser
    });
    document.addEventListener('keydown', this.handleKey);
    document.addEventListener('keyup', this.handleKey);
  },

  componentWillUnmount: function () {
    this.state.live.off({
      'new-game': this.handleNewGame,
      g: this.handleGame,
      'remove-user': this.removeUser
    });
    document.removeEventListener('keydown', this.handleKey);
    document.removeEventListener('keyup', this.handleKey);
  },

  ping: function () {
    this.state.live.send('ping', Date.now(), this.handlePing);
    clearTimeout(this.pingTimeoutId);
    this.pingTimeoutId = _.delay(this.ping, PING_WAIT);
  },

  handlePing: function (er, data) {
    if (er) throw new Error('Echo failed!');
    var start = data.then;
    var then = data.now;
    var now = Date.now();
    var lag = (now - start) / 2;
    var offset = now - then - lag;
    this.update({pings: {$splice: [
      [0, 0, {lag: lag, offset: offset}],
      [PINGS_TO_HOLD, 1]
    ]}});
  },

  getPing: function () {
    var pings = this.state.pings;
    return _.sortBy(pings, 'lag')[Math.ceil(pings.length / 2)] || {
      lag: 0,
      offset: 0
    };
  },

  getLoss: function () {
    var losses = this.state.losses;
    if (!losses.length) return 0;
    var loss = _.filter(losses);
    return Math.round(10000 * loss.length / losses.length) / 100;
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

  handleNewGame: function (g) {
    if (this.game) Game.stop(this.game);
    this.game = Game.create();
    this.game.id = _.uniqueId();
    Game.start(this.game);
    this.updateGame(g);
    this.forceUpdate();
  },

  handleGame: function (g) {
    var ping = this.getPing();
    var tardiness = Date.now() - g.t - ping.offset - ping.lag;
    var tardy = tardiness > MAX_TARDINESS;
    if (!tardy) this.updateGame(g);
    this.update({losses: {$splice: [
      [0, 0, tardy ? 1 : 0],
      [LOSSES_TO_HOLD, 1]
    ]}});
  },

  updateGame: function (g) {
    var dt = g.t - this.game.time;
    this.game.time = g.t;
    if (dt) _.each(g.u, _.partial(this.updateUser, _, dt));
  },

  updateUser: function (u, dt) {
    var game = this.game;
    var id = u[0];
    var user = Game.createObject(game, {type: 'user', id: id});
    user.vx = (u[1] - user.mesh.position.x) / dt;
    user.vy = (u[2] - user.mesh.position.y) / dt;
  },

  removeUser: function (u) {
    Game.removeUser(this.game, {id: u[0]});
  },

  renderGame: function () {
    if (!this.game) return;
    return (
      <GameComponent
        key={this.game.id}
        game={this.game}
        cursors={{
          user: this.getCursor('user'),
          fps: this.getCursor('fps')
        }}
      />
    );
  },

  render: function () {
    var ping = this.getPing();
    return (
      <div>
        <div className='stats'>
          <div>FPS: {this.state.fps}</div>
          <div>Lag: {ping.lag}ms</div>
          <div>Offset: {ping.offset}ms</div>
          <div>Loss: {this.getLoss()}%</div>
          {this.game ? null : <div>Loading...</div>}
        </div>
        {this.renderGame()}
      </div>
    );
  }
});
