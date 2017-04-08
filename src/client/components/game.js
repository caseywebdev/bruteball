import GameScene from '../scenes/game';
import React, {Component} from 'react';

export default class extends Component {
  componentWillMount() {
    this.scene = new GameScene({game: this.props.game});
  }

  componentDidMount() {
    this.el.appendChild(this.scene.renderer.domElement);
  }

  componentWillUnmount() {
    this.scene.destroy();
  }

  render() {
    return <div ref={c => this.el = c} />;
  }
}
