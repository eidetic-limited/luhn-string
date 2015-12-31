var gulp = require('gulp');
var jshint = require('gulp-jshint');
var wrapjs = require('gulp-wrap-js');


gulp.task('hint',  function(){
  // wrap in function and call to avoid Hint error >
  /*
  Use the function form of "use strict".
  'require' is not defined.
  'module' is not defined.
  */
  return gulp.src([
      './*.js'
    ])
  .pipe(wrapjs('(function(module, require){%= body %})(module, require);'))
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

gulp.task('watch', function(){
  gulp.watch('./luhn-string.js',['hint']);
});