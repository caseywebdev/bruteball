import Game from '../objects/game';
import GameComponent from './game';
import React from 'react';
import Regions from './regions';
import styles from './home.scss';
import Ball from '../objects/ball';

const game = new Game();
const ball = game.createObject(Ball, {x: 16, y: 16});

export default () =>
  <div className={styles.root}>
    <Regions />
    <GameComponent {...{ball, game}} />
  </div>;
