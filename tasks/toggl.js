/*
 * grunt-toggl
 * https://github.com/davidosomething/grunt-toggl
 *
 * Copyright (c) 2014 David O'Trakoun
 * Licensed under the MIT license.
 */

'use strict';

var _       = require('lodash');
var print   = require('node-print');
var request = require('request');

module.exports = function(grunt) {
  var _this;
  var done;
  var currentTaskID;
  var moreToDo;

  function makeRequest (listMode) {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = _this.options({
      settingsFile: '.toggl',
      data:         {}
    });

    // request form data
    var settings = {
      apiKey:     null,
      workspace:  null,
      project:    null
    };

    // request params
    var params = {};

    // thing to do
    var runMode = '';

    // temp error object storage
    var err = null;


////////////////////////////////////////////////////////////////////////////////
// CALLBACKS
////////////////////////////////////////////////////////////////////////////////

    /**
     * asynchronousCall requestCallback
     *
     * @TODO use a _.filter for keys or something more efficient than `delete`
     * @param string runMode
     * @param string|object body
     * @return void
     */
    function requestCallback(runMode, body) {
      if (runMode === 'listWorkspaces') {
        _.forEach(body, function (workspace, index) {
          delete workspace.admin;
          delete workspace.at;
          delete workspace.default_currency;
          delete workspace.default_hourly_rate;
          delete workspace.logo_url;
          delete workspace.only_admins_may_create_projects;
          delete workspace.only_admins_see_billable_rates;
          delete workspace.only_admins_see_team_dashboard;
          delete workspace.projects_billable_by_default;
          delete workspace.rounding;
          delete workspace.rounding_minutes;
        });

        grunt.log.subhead('Listing your workspaces');
        print.pt(body);
      }

      else if (runMode === 'listProjects') {
        _.forEach(body, function (project, index) {
          delete project.auto_estimates;
          delete project.created_at;
          delete project.color;
          delete project.at;
          delete project.template;
          delete project.actual_hours;
          delete project.guid;
          delete project.wid;
        });

        grunt.log.subhead('Listing projects in workspace ' + settings.workspace);
        print.pt(body);
      }

      else if (runMode === 'current' || (runMode === 'stopCurrent' && currentTaskID === undefined)) {
        if(runMode === 'stopCurrent') {
          moreToDo = true;
        }
        grunt.log.oklns('Grabbing current timer!');
      }

      else if (runMode === 'stopCurrent') {
        grunt.log.oklns('Current Toggl timer (maybe) stopped!');
      }

      else {
        grunt.log.oklns('New Toggl timer (maybe) started!');
      }

      if(moreToDo) {
        moreToDo = false;
        if(listMode === 'stopCurrent') {
          if(!body.data) {
            grunt.log.errorlns("No current timer running. Nothing to stop.");
            done();
          } else {
            currentTaskID = body.data.id;
            makeRequest(listMode);
          }
        }
      } else {
        // end async grunt task
        done();
      }
    }

////////////////////////////////////////////////////////////////////////////////
// READ SETTINGS
////////////////////////////////////////////////////////////////////////////////
    // Try reading settingsFile
    if (options.settingsFile) {
      var fileSettings = grunt.file.readJSON(options.settingsFile);
      settings = _.extend(settings, fileSettings);
    }

    if (options.apiEnvVar) {
      settings.apiKey = process.env[options.apiEnvVar];
    }

    var optionalDescription = grunt.option('desc');
    if(!settings.data) {
      settings.data = {};
    }
    if(!settings.data.description) {
      settings.data.description = "";
    }
    if (optionalDescription) {
      if (settings.data.description) {
        options.data.description = settings.data.description + " " + optionalDescription;
      } else {
        options.data.description = optionalDescription;
      }
    }

    // Use option values, overrides file values if any, otherwise default nulls
    settings.apiKey    = options.apiKey    ? options.apiKey    : settings.apiKey;
    settings.workspace = options.workspace ? options.workspace : settings.workspace;
    settings.project   = options.project   ? options.project   : settings.project;

    // Make sure we have a key
    if (typeof settings.apiKey !== 'string' || !settings.apiKey.length) {
      err = new Error('grunt-toggl needs an api key to work.');
      grunt.fail.warn(err);
    }

////////////////////////////////////////////////////////////////////////////////
// CREATE REQUEST PARAMS
////////////////////////////////////////////////////////////////////////////////
    // Set request params
    params.auth = {
      user: settings.apiKey,
      pass: 'api_token',
      sendImmediately: true
    };
    params.json = true;

    // runMode specific request params
    // list workspaces?
    if (listMode === 'workspaces' || !settings.workspace || isNaN(settings.workspace)) {
      runMode = 'listWorkspaces';
      params.url = 'https://www.toggl.com/api/v8/workspaces';
      params.method = 'GET';
    }

    // list projects (has workspace)
    else if (listMode === 'projects') {
      runMode = 'listProjects';
      params.url = 'https://www.toggl.com/api/v8/workspaces/' + settings.workspace + '/projects';
      params.method = 'GET';
    }

    // get current time entry
    else if (listMode === 'current' || (listMode === 'stopCurrent' && currentTaskID === undefined)) {
      runMode = listMode;
      params.url = 'https://www.toggl.com/api/v8/time_entries/current';
      params.method = 'GET';
    }

    // stop current time entry
    else if (listMode === 'stopCurrent') {
      runMode = 'stopCurrent';
      params.url = 'https://www.toggl.com/api/v8/time_entries/' + currentTaskID + '/stop';
      params.method = 'PUT';
    }

    // create time entry
    else {
      runMode = 'create';
      params.url = 'https://www.toggl.com/api/v8/time_entries';
      params.method = 'POST';

      var date = new Date();
      var start = date.toISOString();
      var duration = -(date.getTime() / 1000); // must be in SECONDS
      var defaults = {
        wid:          settings.workspace,
        start:        start,
        duration:     duration,
        created_with: 'grunt-toggl'
      };
      if (settings.project) {
        defaults.pid = settings.project;
      }
      var timeEntryData = _.extend(defaults, options.data);
      params.body = {
        time_entry: timeEntryData
      };
    }

////////////////////////////////////////////////////////////////////////////////
// DO REQUEST
////////////////////////////////////////////////////////////////////////////////
    // Using Request HTTP module, make a request to Toggl API to start timer
    request(params, function (error, response, body) {
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

      requestCallback(runMode, body);
    });
  }

  grunt.registerMultiTask('toggl',
    'Toggl API for Grunt. E.g. start time tracking with `grunt watch` or `grunt toggl`',
    function (listMode) {
      // Request is asynchronous
      done = this.async();
      _this = this;
      makeRequest(listMode);
    });
};