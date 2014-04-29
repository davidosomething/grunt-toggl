/*
 * grunt-toggl
 * https://github.com/davidosomething/grunt-toggl
 *
 * Copyright (c) 2014 David O'Trakoun
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

////////////////////////////////////////////////////////////////////////////////
    bump: {
      options: {
        commit:    false,
        createTag: false,
        push:      false
      }
    },

////////////////////////////////////////////////////////////////////////////////
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

////////////////////////////////////////////////////////////////////////////////
    // Configuration to be run (and then tested).
    toggl: {

      ////////////////////////////////////////
      // Valid
/*
      validApiKey: {
        options: {
          apiKey: ''
        }
      },
*/
      validSettingsFile: {
        options: {
          settingsFile: 'test/fixtures/valid'
        },
      },

      ////////////////////////////////////////
      // Invalid
      noKey: {
      },

      invalidApiKey: {
        options: {
          apiKey: 'invalid'
        }
      },

      missingSettingsFile: {
        options: {
          settingsFile: 'missing'
        },
      },

      invalidSettingsFile: {
        options: {
          settingsFile: 'test/fixtures/invalid'
        },
      },

      noKeyInSettingsFile: {
        options: {
          settingsFile: 'test/fixtures/nokey'
        },
      }
    },

////////////////////////////////////////////////////////////////////////////////
    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

////////////////////////////////////////////////////////////////////////////////
  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

////////////////////////////////////////////////////////////////////////////////
  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'toggl', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
