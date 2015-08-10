var MINIFY = !!process.env.MINIFY;

module.exports = {
  manifestPath: 'public/manifest.json',
  in: {
    vert: {out: 'js', transformers: 'text'},
    frag: {out: 'js', transformers: 'text'},
    es6: {
      out: 'js',
      transformers: ['directives', {name: 'babel', options: {modules: 'amd'}}]
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
          except: [
            '**/*+(-|.)min.js',
            '**/*/Box2D*.js'
          ],
          options: {compress: {global_defs: {__DEV__: false}}}
        } : [],
        {name: 'prepend-path', options: {before: '// '}}
      )
    }
  },
  builds: {
    'src/client/index.es6': 'public'
  }
};
