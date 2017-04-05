import Game from './game';
import React from 'react';
import Regions from './regions';
import styles from '../styles/home';

export default () =>
  <div className={styles.root}>
    <Regions />
    <Game />
  </div>;
