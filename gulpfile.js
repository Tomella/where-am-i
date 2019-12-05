// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var fs            = require('fs');
var eslint        = require('gulp-eslint');
var babel         = require('gulp-babel');
var concat        = require('gulp-concat');
var concatCss     = require('gulp-concat-css');
var rename        = require('gulp-rename');

var directories = {
	assets:      'web/app',
   source:      'src'
};

// Lint Task
gulp.task('lint', function() {
    return gulp.src('web/app/**/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

// Watch Files For Changes
gulp.task('watch', function() {
	// We watch both JS and HTML files.
    gulp.watch('web/app/**/*.js', ['lint']);
    gulp.watch(directories.source + '/**/*.css', ['concatCss']);
});

gulp.task('concatCss', function () {
  return gulp.src(directories.source + '/**/*.css')
    .pipe(concatCss("app.css"))
    .pipe(gulp.dest(directories.assets));
});

gulp.task('build', ['concatCss'])

// Default Task
gulp.task('default', ['lint', 'concatCss', 'watch']);
