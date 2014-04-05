var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');

gulp.task('lint', function() {
    return gulp.src(['./src/**/*.js', './test/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

function test(srcPath) {
    return gulp.src(srcPath)
        .pipe(mocha())
        .on('error', gutil.log);
}

gulp.task('commitTests', function() {
    return test('./test/commit/**/*.js');
});

gulp.task('acceptanceTests', function() {
    return test('./test/acceptance/**/*.js');
});

gulp.task('watch', ['lint', 'commitTests', 'acceptanceTests']);

gulp.task('default', ['watch'], function() {
    gulp.watch(['./src/**/*.js', './test/**/*.js'], ['watch']);
});
