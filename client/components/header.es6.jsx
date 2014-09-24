/** @jsx React.DOM */

import Cursors from 'cursors';
import React from 'react';
import store from 'store';

export default React.createClass({
  mixins: [Cursors],

  getInitialState: function () {
    return {
      key: store.get('key')
    };
  },

  signOut: function () {
    this.state.live.fetchAuthKey = null;
    store.remove('key');
    this.update({key: {$set: null}});
    this.state.live.send('sign-out', null, this.handleSignOut);
  },

  handleSignOut: function (er) {
    if (!er) this.update({user: {$set: null}});
  },

  componentDidMount: function () {
    this.state.live.on('live:state:connected', this.handleConnected);
    this.state.live.connect();
    if (this.state.key) this.signIn();
  },

  componentWillUnmount: function () {
    this.state.live.off('live:state:connected', this.handleConnected);
  },

  handleConnected: function (__, user) {
    this.update({user: {$set: user}});
  },

  fetchAuthKey: function (cb) {
    cb(null, store.get('key'));
  },

  signIn: function () {
    this.state.live.send('auth', this.state.key, this.handleAuth);
  },

  handleAuth: function (er, user) {
    if (er) return window.alert(er.toString());
    this.state.live.fetchAuthKey = this.fetchAuthKey;
    store.set('key', this.state.key);
    this.update({user: {$set: user}});
  },

  handleChange: function (ev) {
    this.update({key: {$set: ev.target.value}});
  },

  renderSignedIn: function () {
    return (
      <div>
        You are {this.state.user.display_name}!
        <button type='button' onClick={this.signOut}>Sign Out</button>
      </div>
    );
  },

  renderSignedOut: function () {
    return (
      <div>
        <input
          placeholder='Your OrgSync API Key'
          value={this.state.key}
          onChange={this.handleChange}
        />
        <button type='button' onClick={this.signIn}>Sign In</button>
      </div>
    );
  },

  render: function () {
    return (
      <div>
        <h1>TagPro</h1>
        {this.state.user ? this.renderSignedIn() : this.renderSignedOut()}
      </div>
    );
  }
});
