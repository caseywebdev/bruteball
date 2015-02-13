import _ from 'underscore';
import average from 'shared/utils/average';
import Cursors from 'cursors';
import * as Game from 'shared/objects/game';
import GameComponent from 'client/components/game';
import React from 'react';
import THREE from 'three';

var KEYS = {
  '38': {down: false, direction: new THREE.Vector2(0, 1)},
  '40': {down: false, direction: new THREE.Vector2(0, -1)},
  '37': {down: false, direction: new THREE.Vector2(-1, 0)},
  '39': {down: false, direction: new THREE.Vector2(1, 0)}
};

var PING_WAIT = 2000;
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
    this.state.socket
      .on('new-game', this.handleNewGame)
      .on('g', this.handleGame)
      .on('remove-user', this.removeUser);
    document.addEventListener('keydown', this.handleKey);
    document.addEventListener('keyup', this.handleKey);
  },

  componentWillUnmount: function () {
    this.state.socket
      .off('new-game', this.handleNewGame)
      .off('g', this.handleGame)
      .off('remove-user', this.removeUser);
    document.removeEventListener('keydown', this.handleKey);
    document.removeEventListener('keyup', this.handleKey);
  },

  ping: function () {
    this.state.socket.emit('ping', Date.now(), this.handlePing);
    clearTimeout(this.pingTimeoutId);
    this.pingTimeoutId = _.delay(this.ping, PING_WAIT);
  },

  handlePing: function (er, then) {
    if (er) throw new Error('Ping failed!');
    this.update({pings: {$splice: [
      [0, 0, Date.now() - then],
      [PINGS_TO_HOLD, 1]
    ]}});
  },

  getPing: function () {
    return Math.ceil(average(this.state.pings));
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
    this.state.socket.emit('set-av', this.getAv().toArray());
  },

  getAv: function () {
    return _.reduce(_.filter(KEYS, 'down'), function (av, key) {
      return av.add(key.direction);
    }, new THREE.Vector2());
  },

  handleNewGame: function (g) {
    if (this.game) Game.stop(this.game);
    this.game = Game.create();
    this.game.id = _.uniqueId();
    this.game.step = g.s;
    Game.applyFrame(this.game, g);
    Game.start(this.game);
    this.forceUpdate();
  },

  handleGame: function (g) {
    if (this.game) Game.addFrame(this.game, g);
  },

  removeUser: function (u) {
    Game.destroyObject(this.game, {type: 'user', id: u[0]});
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
    return (
      <div>
        <div
          style={{
            color: 'white',
            left: 0,
            padding: 10,
            position: 'fixed',
            textShadow: '0 1px 2px #000',
            top: 0
          }}
        >
          <div>FPS: {this.state.fps}</div>
          <div>Ping: {this.getPing()}</div>
          <div>Jitter: {this.game ? Game.getJitter(this.game) : 0}</div>
          {this.game ? null : <div>Loading...</div>}
        </div>
        {this.renderGame()}
      </div>
    );
  }
});
