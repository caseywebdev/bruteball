module.exports = {
  manifestPath: 'manifest-server.json',
  in: {
    es6: {out: 'js', transformers: ['directives', '6to5']},
    js: {transformers: 'directives'}
  },
  builds: {
    'src/server/**/*': 'build/node_modules',
    'src/shared/**/*': 'build/node_modules/shared',
    'src/box2d.js': 'build/node_modules',
    'bower_components/underscore/underscore.js': 'build/node_modules'
  }
};
