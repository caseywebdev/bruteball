import Cursors from 'cursors';
import React from 'react';
import store from 'client/store';

export default React.createClass({
  mixins: [Cursors],

  getInitialState: function () {
    return {
      isLoading: false
    };
  },

  signOut: function () {
    store.remove('key');
    this.update({
      isLoading: {$set: true},
      key: {$set: null}
    });
    this.state.socket.emit('sign-out', null, this.handleSignOut);
  },

  handleSignOut: function (er) {
    var deltas = {isLoading: {$set: false}};
    if (!er) deltas.user = {$set: null};
    this.update(deltas);
  },

  componentDidMount: function () {
    this.state.socket.on('connect', this.handleConnect);
  },

  componentWillUnmount: function () {
    this.state.socket.off('connect', this.handleConnect);
  },

  handleConnect: function () {
    this.setKey();
  },

  setKey: function () {
    this.update({isLoading: {$set: true}});
    this.state.socket.emit('set-key', store.get('key'), this.handleSetKey);
  },

  handleSetKey: function (er, user) {
    if (er) return this.signOut();
    store.set('key', user.key);
    this.update({isLoading: {$set: false}, user: {$set: user}});
  },

  handleSignInClick: function () {
    this.signIn(this.refs.key.getDOMNode().value);
  },

  handleChange: function (ev) {
    this.update({key: {$set: ev.target.value}});
  },

  renderSignedIn: function () {
    return (
      <div>
        You are {this.state.user.name}!
      </div>
    );
  },

  renderSignedOut: function () {
    return (
      <div>
        <input
          placeholder='Your OrgSync API Key'
          ref='key'
        />
        <button type='button' onClick={this.handleSignInClick}>Sign In</button>
      </div>
    );
  },

  render: function () {
    return null;
  }
});
