var gulp = require('gulp'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
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

gulp.watch('app/**', ['js' , 'css']);

gulp.task('default', ['js' , 'css']);
