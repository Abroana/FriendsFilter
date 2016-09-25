var gulp = require('gulp'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    cssimport = require('postcss-import'),
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
  var processors = [
        cssimport({from: 'app/css/style.css'}),
        autoprefixer({browsers: ['> 1%']})
      ];
  gulp.src('app/css/style.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('dist/css'));
});

/*gulp.task('html', function() {
  gulp.src('app/index.html')
    .pipe(gulp.dest('dest'));
});*/

gulp.watch('app/**', ['js' , 'css']);

gulp.task('default', ['js' , 'css']);
