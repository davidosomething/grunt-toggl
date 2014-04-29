/*
 * grunt-toggl
 * https://github.com/davidosomething/grunt-toggl
 *
 * Copyright (c) 2014 David O'Trakoun
 * Licensed under the MIT license.
 */

'use strict';

var request = require('request');
var _ = require('lodash');

module.exports = function(grunt) {


  grunt.registerMultiTask(
    'toggl',
    'Toggl API for Grunt. E.g. start time tracking with `grunt watch` or `grunt toggl`',
    function (getWorkspaces) {

    // Request is asynchronous
    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      settingsFile: '.toggl',
      workspace:    null,
      data:         {}
    });

    var err = null;
    var apiKey = null;
    var workspace = null;
    var params = {};

////////////////////////////////////////////////////////////////////////////////

    /**
     * validateKey
     */
    function validateKey() {
      if (typeof apiKey !== 'string' || !apiKey.length) {
        err = new Error('grunt-toggl needs an api key to work.');
        grunt.fail.warn(err);
      }
    }

    /**
     * asynchronousCall requestCallback
     * @param object error
     * @param object response
     * @param object body
     * @return void
     */
    function requestCallback(error, response, body) {
      if (error) {
        grunt.fail.warn(error);
      }

      if (response.statusCode === 403) {
        err = new Error("Authorization failed, check your API key.");
        grunt.fail.warn(err, response.statusCode);
      }

      if (response.statusCode !== 200) {
        err = new Error(body);
        grunt.fail.warn(err, response.statusCode);
      }

      done();
    }

////////////////////////////////////////////////////////////////////////////////

    // Try reading settingsFile
    if (options.settingsFile) {
      var settings = grunt.file.readJSON(options.settingsFile);
      if (settings.apiKey) {
        apiKey = settings.apiKey;
      }
      if (settings.workspace) {
        workspace = settings.workspace;
      }
    }

    // Use option values, override file values
    if (options.apiKey) {
      apiKey = options.apiKey;
    }
    if (options.workspace) {
      workspace = options.workspace;
    }

    // Make sure we have a key
    validateKey();

    params.auth = {
      user: apiKey,
      pass: 'api_token',
      sendImmediately: true
    };
    params.json = true;

    // show workspaces
    if (getWorkspaces || !workspace || isNaN(workspace)) {
      params.url = 'https://www.toggl.com/api/v8/workspaces';
      params.method = 'GET';
    }

    // create time entry
    else {
      params.url = 'https://www.toggl.com/api/v8/time_entries';
      params.method = 'POST';

      var date = new Date();
      var start = date.toISOString();
      var duration = -(date.getTime() / 1000); // must be in SECONDS
      var defaults = {
        wid:          workspace,
        start:        start,
        duration:     duration,
        created_with: 'grunt-toggl'
      };
      var timeEntryData = _.extend(defaults, options.data);
      params.body = {
        time_entry: timeEntryData
      };
    }

    // Using Request HTTP module, make a request to Toggl API to start timer
    request(params, requestCallback);
  });

};
