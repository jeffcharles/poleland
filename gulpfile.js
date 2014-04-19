/* global require */
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');

gulp.task('lint', function() {
    return gulp.src(['./gulpfile.js',
                     './src/**/*.js', '!./src/static/bower_components{,/**}',
                     './test/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

function test(srcPath) {
    return gulp.src(srcPath, {read: false})
        .pipe(mocha());
}

gulp.task('commitTests', function() {
    return test('./test/commit/**/*.js');
});

gulp.task('acceptanceTests', function() {
    return test('./test/acceptance/**/*.js');
});

gulp.task('default', ['lint', 'commitTests', 'acceptanceTests']);
