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
        pkg: grunt.file.readJSON('package.json')
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['jshint']);
};
