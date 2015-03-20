module.exports = {
  manifestPath: 'build/manifest.json',
  in: {
    es6: {out: 'js', transformers: ['directives', 'babel']},
    js: {transformers: 'directives'}
  },
  builds: {
    'src/server/**/*': 'build/node_modules',
    'src/shared/**/*': 'build/node_modules/shared',
    'src/box2d.js': 'build/node_modules',
    'bower_components/underscore/underscore.js': 'build/node_modules'
  }
};
