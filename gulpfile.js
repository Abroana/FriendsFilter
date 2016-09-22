var gulp = require('gulp'),
    browserify = require('gulp-browserify');

gulp.task('js', function() {
  gulp.src('app/js/app.js')
    .pipe(browserify({
      insertGlobals : true,
      debug : !gulp.env.production
    }))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('css', function() {
  gulp.src('app/css/style.css')
    .pipe(gulp.dest('dist/css'));
});

gulp.watch('app/**', function(event) {
  gulp.run('js');
  gulp.run('css');
});
