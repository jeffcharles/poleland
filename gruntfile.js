module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            all: ['app.js', 'gruntfile.js', 'routes/**/*.js']
        },
        pkg: grunt.file.readJSON('package.json')
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['jshint']);
};
