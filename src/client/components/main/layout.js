// import {Route, Switch} from 'react-router-dom';
// import Home from '../home';
// import NotFound from '../not-found';
// import React from 'react';
// import styles from './main.scss';
// import User from '../user';
// import Verify from '../verify';

// export default () =>
//   <div>
//     <div className={styles.headerWrapper}>
//       <div className={styles.header}>
//         <div className={styles.headerLeft}>
//           Bruteball
//         </div>
//         <div className={styles.headerRight}>
//           <User />
//         </div>
//       </div>
//     </div>
//     <div className={styles.body}>
//       <Switch>
//         <Route exact path='/verify' component={Verify} />
//         <Route exact path='/' component={Home} />
//         <Route component={NotFound} />
//       </Switch>
//     </div>
//   </div>;

import Game from '../../objects/game';
import GameComponent from '../game';
import React from 'react';
import Ball from '../../objects/ball';

const game = new Game();
const ball = game.createObject(Ball, {x: 16, y: 16});

export default () =>
  <GameComponent {...{ball, game}} />;
