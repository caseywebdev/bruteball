/** @jsx React.DOM */

import _ from 'underscore';
import Cursors from 'cursors';
import Game from 'shared/entities/game';
import GameComponent from 'client/components/game';
import React from 'react';

var KEYS = {
  '38': {down: false, x: 0, y: 1},
  '40': {down: false, x: 0, y: -1},
  '37': {down: false, x: -1, y: 0},
  '39': {down: false, x: 1, y: 0}
};

var PING_DELAY = 1000;

var getMedian = function (array) {
  return _.sortBy(array)[Math.floor(array.length / 2)];
};

export default React.createClass({
  mixins: [Cursors],

  getInitialState: function () {
    return {
      game: Game.create(),
      offset: 0,
      latency: 0,
      fps: 0
    };
  },

  componentDidMount: function () {
    this.offsets = [];
    this.latencies = [];
    this.state.live.on('g', this.handleGame);
    this.state.live.on('r', this.removeUser);
    this.ping();
    document.addEventListener('keydown', this.handleKey);
    document.addEventListener('keyup', this.handleKey);
  },

  componentWillUnmount: function () {
    this.state.live.off('g', this.handleGame);
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
    this.state.live.send('ping', Date.now(), this.handlePing);
    this.pingTimeoutId = _.delay(this.ping, PING_DELAY);
  },

  handlePing: function (er, res) {
    var start = res.then;
    var then = res.now;
    var now = Date.now();
    this.offsets = [now - then].concat(this.offsets.slice(0, 4));
    this.latencies = [(now - start) / 2].concat(this.latencies.slice(0, 4));
    this.update({
      offset: {$set: getMedian(this.offsets)},
      latency: {$set: getMedian(this.latencies)}
    });
  },

  getAv: function () {
    return _.reduce(_.filter(KEYS, {down: true}), function (av, key) {
      return {x: av.x + key.x, y: av.y + key.y};
    }, {x: 0, y: 0});
  },

  handleGame: function (g) {
    var normalized = g.s + this.state.offset - this.state.latency;
    if (!this.first) {
      this.state.game.lastStep = normalized;
      this.first = true;
    }
    var wait = normalized - this.state.game.lastStep;
    _.delay(_.partial(this.updateGame, g), wait);
  },

  updateGame: function (g) {
    Game.step(this.state.game);
    this.state.game.time = g.t;
    _.each(g.u, this.updateUser);
  },

  updateUser: function (u) {
    var game = this.state.game;
    var id = u[0];
    if (!game.users[id]) Game.addUser(game, {id: id});
    var user = game.users[id];
    var position = user.ball.body.GetPosition();
    var cx = position.get_x();
    var cy = position.get_y();
    var dx = u[1] - cx;
    var dy = u[2] - cy;
    position.Set(
      Math.abs(dx) > 1 ? u[1] : cx + (dx * 0.1),
      Math.abs(dy) > 1 ? u[2] : cy + (dy * 0.1)
    );
    user.ball.body.SetTransform(position, user.ball.body.GetAngle());
    var velocity = user.ball.body.GetLinearVelocity();
    velocity.Set(u[3], u[4]);
    user.ball.body.SetLinearVelocity(velocity);
    user.acceleration.Set(u[5], u[6]);
  },

  removeUser: function (u) {
    Game.removeUser(this.state.game, {id: u[0]});
  },

  render: function () {
    return (
      <div>
        <div className='latency'>
          Latency: {this.state.latency}ms<br />
          FPS: {this.state.fps}
        </div>
        <GameComponent cursors={{
          game: this.getCursor('game'),
          user: this.getCursor('user'),
          fps: this.getCursor('fps')
        }} />
      </div>
    );
  }
});
