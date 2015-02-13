const NODE_ENV = process.env.NODE_ENV || 'development';
const MINIFY = NODE_ENV === 'production';

module.exports = {
  manifestPath: 'manifest-client.json',
  in: {
    vert: {out: 'js', transformers: 'text'},
    frag: {out: 'js', transformers: 'text'},
    es6: {
      out: 'js',
      transformers: ['directives', {name: '6to5', options: {modules: 'amd'}}]
    },
    js: {
      transformers: [
        'directives',
        {
          name: 'concat-amd',
          options: {
            base: 'src',
            extensions: ['js', 'es6', 'vert', 'frag']
          }
        }
      ]
      .concat(
        MINIFY ? {
          name: 'uglify-js',
          except: '**/*+(.|-)min.js',
          options: {compress: {global_defs: {__DEV__: false}}}
        } : [],
        {name: 'prepend-path', options: {before: '// '}}
      )
    }
  },
  'builds': {
    'src/client/index.es6': 'public'
  }
};
