'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var wrench = require('wrench');
var coveralls = require('gulp-coveralls');

var options = {
  app: 'app',
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
  errorHandler: function(title) {
    return function(err) {
      gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
      this.emit('end');
    };
  },
  wiredep: {
    directory: 'bower_components',
    devDependencies: true
  }
};

wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file)(options);
});

gulp.task('default', ['clean'], function() {
    gulp.start('build');
});

gulp.task('ci', ['build', 'test'], function() {
  return gulp.src('build/**/lcov.info')
    .pipe(coveralls());
});
