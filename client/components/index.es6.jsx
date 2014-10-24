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

var PING_WAIT = 1000;
var PINGS_TO_HOLD = 10;

export default React.createClass({
  mixins: [Cursors],

  getInitialState: function () {
    return {
      fps: 0,
      pings: []
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
    var offset = now - then;
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

  handleKey: function (ev) {
    var key = KEYS[ev.which];
    var state = ev.type === 'keydown';
    if (!key || key.down === state) return;
    key.down = state;
    this.sendAv();
    ev.preventDefault();
  },

  sendAv: function () {
    var av = this.getAv();
    this.state.live.send('set-av', av);
    Game.setAcceleration(this.game, this.state.user, av.x, av.y);
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
    var delay = g.t + this.getPing().offset - Date.now();
    console.log(delay);
    this.updateGame(g);
  },

  updateGame: function (g) {
    Game.step(this.game);
    _.each(g.u, this.updateUser);
  },

  updateUser: function (u) {
    var game = this.game;
    var id = u[0];
    if (!game.users[id]) Game.addUser(game, {id: id});
    var user = game.users[id];
    var position = user.ball.body.GetPosition();
    var cx = position.get_x();
    var cy = position.get_y();
    var dx = u[1] - cx;
    var dy = u[2] - cy;
    var far = Math.sqrt((dx * dx) + (dy * dy)) > 1;
    position.Set(far ? u[1] : cx + (dx * 0.1), far ? u[2] : cy + (dy * 0.1));
    user.ball.body.SetTransform(position, user.ball.body.GetAngle());
    var velocity = user.ball.body.GetLinearVelocity();
    velocity.Set(u[3], u[4]);
    user.ball.body.SetLinearVelocity(velocity);
    user.acceleration.Set(u[5], u[6]);
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
          {this.game ? null : <div>Loading...</div>}
        </div>
        {this.renderGame()}
      </div>
    );
  }
});
