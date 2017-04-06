import shared from '../shared/config';

const {env} = window;

export default {
  ...shared,
  disk: {
    namespace: 'bruteball'
  },
  livereload: {
    url: env.LIVERELOAD_URL
  }
};
