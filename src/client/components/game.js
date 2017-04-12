import _ from 'underscore';
import React, {Component} from 'react';
import {Vector2} from 'three';

const KEYS = {
  38: {down: false, direction: new Vector2(0, 1)},
  40: {down: false, direction: new Vector2(0, -1)},
  37: {down: false, direction: new Vector2(-1, 0)},
  39: {down: false, direction: new Vector2(1, 0)}
};

const getAv = () =>
  _.reduce(
    KEYS,
    (av, key) => key.down ? av.add(key.direction) : av,
    new Vector2()
  );

export default class extends Component {
  componentDidMount() {
    document.addEventListener('keydown', this.handleKey);
    document.addEventListener('keyup', this.handleKey);
    this.el.appendChild(this.props.game.renderer.domElement);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKey);
    document.removeEventListener('keyup', this.handleKey);
  }

  handleKey = ev => {
    const key = KEYS[ev.which];
    const state = ev.type === 'keydown';
    if (!key || key.down === state) return;

    key.down = state;
    this.props.ball.setAcceleration(getAv());
  }

  render() {
    return <div ref={c => this.el = c} style={{top: 0, left: 0, position: 'fixed'}}/>;
  }
}
