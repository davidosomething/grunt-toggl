/*
 * grunt-toggl
 * https://github.com/davidosomething/grunt-toggl
 *
 * Copyright (c) 2014 David O'Trakoun
 * Licensed under the MIT license.
 */

'use strict';

var request = require('request');

module.exports = function(grunt) {


  grunt.registerMultiTask('toggl', 'Toggl API for Grunt. E.g. start time tracking with `grunt watch` or `grunt toggl`', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      apiKey:       '',
      settingsFile: ''
    });

    var err;
    var apiKey;

    /**
     * getKey
     * Get the user's API key for the Toggl API using the specified option or
     * from a shell environment variable.
     *
     * @return string API key for toggl API
     */
    function getKey() {
      var err;
      var settings;

      // use manually set key (least secure)
      if (options.apiKey) {
        return options.apiKey;
      }

      // get key from settings file
      else if (options.settingsFile) {
        // missing file would exit with default grunt error

        settings = grunt.file.readJSON(options.settingsFile);

        // invalid format would exit with default grunt error

        if (settings['apiKey']) {
          return settings['apiKey'];
        }

        // no api key in file, or invalid format
        else {
          err = new Error('settingsFile "' + options.settingsFile + '" is missing an "apiKey".');
          grunt.fail.warn(err);
        }
      }

      // Check ENV variables
      else {
        err = new Error('grunt-toggl needs an api key to work.');
        grunt.fail.warn(err);
      }
    }

    apiKey = getKey();
    if (typeof apiKey !== 'string' || !apiKey.length) {
      err = new Error('apiKey must be a string.');
      grunt.fail.warn(err);
    }
    console.log(apiKey);
  });

};
