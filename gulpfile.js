/* global __dirname, console, require */
'use strict';

var del = require('del');
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var mocha = require('gulp-mocha');
var webpack = require('gulp-webpack');

var paths = {
    html: './web-client/**/*.html',
    less: './web-client/index.less',
    js: './web-client/**/*.{js,jsx}'
};

gulp.task('clean', function(next) {
    del(['dist'], next);
});

gulp.task('html', function() {
    return gulp.src(paths.html)
        .pipe(htmlmin({
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
            removeAttributeQuotes: true,
            removeCDATASectionsFromCDATA: true,
            removeComments: true, // should work with IE conditionals
            removeCommentsFromCDATA: true,
            removeEmptyAttributes: true,
            removeOptionalTags: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('less', function() {
    return gulp.src(paths.less)
        .pipe(less({ compress: true }))
        .on('error', function(err) {
            console.error(err);
        })
        .pipe(gulp.dest('./dist'));
});

gulp.task('fonts', function() {
    return gulp.src('./node_modules/bootstrap/dist/fonts/**/*')
        .pipe(gulp.dest('./dist/fonts'));
});

var webpackConfig = {
    context: __dirname + '/web-client',
    entry: './index.js',
    module: {
        loaders: [{ test: /\.jsx$/, loader: 'jsx-loader'}]
    },
    output: { filename: 'index.js' }
};

gulp.task('js', function() {
    return gulp.src(paths.js)
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest('./dist'));
});

gulp.task('watch', ['build'], function() {
    gulp.watch(paths.html, ['html']);
    gulp.watch(paths.less, ['less']);
    gulp.watch(paths.js, ['js']);
});

gulp.task('build', ['html', 'less', 'fonts', 'js']);

gulp.task('lint', function() {
    return gulp.src(['./*.js',
                     './src/**/*.js',
                     './test/**/*.js',
                     './web-client/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
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

gulp.task('default', ['build', 'lint', 'commitTests', 'acceptanceTests']);
