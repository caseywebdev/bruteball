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
      buffer: 0,
      fps: 0
    };
  },

  componentDidMount: function () {
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
    this.game.time = g.t;
    Game.start(this.game);
    this.updateGame(g);
    this.forceUpdate();
  },

  handleGame: function (g) {
    var buffer = this.state.buffer;
    var delta = g.t - this.game.time;
    buffer = Math.max(buffer * 0.99, -delta);
    this.update({buffer: {$set: buffer}});
    _.delay(_.partial(this.updateGame, g), buffer - delta);
  },

  updateGame: function (g) {
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
    return (
      <div>
        <div className='stats'>
          <div>Buffer: {Math.ceil(this.state.buffer)}ms</div>
          <div>FPS: {this.state.fps}</div>
          {this.game ? null : <div>Loading...</div>}
        </div>
        {this.renderGame()}
      </div>
    );
  }
});
