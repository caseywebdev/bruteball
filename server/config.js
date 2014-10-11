module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  url: process.env.URL || 'http://www.bruteball.com',
  cipherAlgorithm: 'aes256',

  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },

  zmq: process.env.ZMQ_URL || 'tcp://127.0.0.1:4000',

  game: {
    fps: 60,
    mps: 30
  },

  knex: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL ||
      'postgres://localhost/bruteball_development',

    pool: {
      min: 2,
      max: 10
    },

    migrations: {
      tableName: 'migrations'
    }
  }
};
