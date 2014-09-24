module.exports = {
  env: process.env.ENV || 'development',
  port: process.env.PORT || 3000,

  game: {
    fps: 60,
    mps: 30
  },
};
