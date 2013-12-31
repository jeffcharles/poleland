/* global module */
module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            all: [
                'app.js', 'blanket.js', 'gruntfile.js', 'src/**/*.js',
                'test/**/*.js'
            ],
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
            acceptanceTests: {
                options: {
                    reporter: 'spec',
                    require: 'blanket'
                },
                src: ['test/acceptance/**/*.js']
            },
            commitTests: {
                options: {
                    reporter: 'spec',
                    require: 'blanket'
                },
                src: ['test/commit/**/*.js']
            },
            coverage: {
                options: {
                    reporter: 'html-cov',
                    quiet: true,
                    captureFile: 'coverage.html'
                }
            }
        },
        pkg: grunt.file.readJSON('package.json')
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('default', ['jshint', 'mochaTest']);
};
