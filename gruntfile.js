/* global module */
module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            all: ['app.js', 'gruntfile.js', 'routes/**/*.js'],
            options: {
                bitwise: true,
                camelcase: true,
                curly: true,
                freeze: true,
                indent: 4,
                latedef: true,
                newcap: true,
                noarg: true,
                noempty: true,
                nonew: true,
                quotmark: 'single',
                undef: true,
                unused: true,
                trailing: true,
                maxlen: 80
            }
        },
        mochaTest: {
            coverage: {
                options: {
                    reporter: 'html-cov',
                    quiet: true,
                    captureFile: 'coverage.html'
                }
            },
            test: {
                options: {
                    reporter: 'spec',
                    require: 'coverage/blanket'
                },
                src: ['test/**/*.js']
            }
        },
        pkg: grunt.file.readJSON('package.json')
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('default', ['jshint', 'mochaTest']);
};
