import b2 from 'box2d';

var node = typeof window === 'undefined';

var ENV_VARS = node ? process.env : {};

export default {
  node: node,
  port: ENV_VARS.PORT,
  store: {prefix: 'app:'},
  aws: {
    accessKeyId: ENV_VARS.AWS_ACCESS_KEY_ID,
    secretAccessKey: ENV_VARS.AWS_SECRET_ACCESS_KEY
  },
  game: {
    dt: 1 / 60,
    linearDamping: 0.5,
    velocityIterations: 8,
    positionIterations: 10,
    acceleration: 5,
    maxSpeed: 7.5,
    stepsPerBroadcast: 15,
    ballRadius: 0.49,
    hatRadius: 0.375,
    bombRadius: 0.4,
    bombWait: 500,
    boostRadius: 0.5,
    boostWait: 500,
    hiddenPosition: new b2.b2Vec2(-1, -1)
  },
  knex: {
    client: 'postgresql',
    connection: ENV_VARS.POSTGRES_URL,
    pool: {min: 2, max: 10},
    migrations: {tableName: 'migrations'}
  }
};
