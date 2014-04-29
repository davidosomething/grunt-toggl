[![Upstream](http://img.shields.io/badge/upstream-GitHub-lightgrey.svg?style=flat)](https://github.com/davidosomething/grunt-toggl)
[![Build Status: Linux](https://travis-ci.org/davidosomething/grunt-toggl.png?branch=master)](https://travis-ci.org/davidosomething/grunt-toggl)
[![dependencies](https://david-dm.org/davidosomething/grunt-toggl.png)](https://david-dm.org/davidosomething/grunt-toggl)
[![NPM version](https://badge.fury.io/js/grunt-toggl.svg)](http://badge.fury.io/js/grunt-toggl)
<br>[![npm Badge](https://nodei.co/npm/grunt-toggl.png?compact=true)](http://npmjs.org/package/grunt-toggl)

# grunt-toggl

> Toggl API for Grunt. E.g. start time tracking with `grunt watch` or
  `grunt toggl`

![Demo of starting a timer from the command line](http://i0.wp.com/davidosomething.com/content/uploads/grunt-toggl.gif)

## Getting Started
This plugin requires Grunt `~0.4.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out
the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains
how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as
install and use Grunt plugins. Once you're familiar with that process, you may
install this plugin with this command:

```shell
npm install grunt-toggl --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile
with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-toggl');
```

## The "toggl" task

### Overview
In your project's Gruntfile, add a section named `toggl` to the data object
passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  toggl: {
    options: {
      apiKey: '',
      settingsFile: 'toggl.json'
      workspace:    null,
      project:      null,
      data: {
        description: '<%= pkg.name %>',
      }
    }
  },
});
```

### Options

Your Toggl API key is required for this task. Get it from your profile on
Toggl.com [https://www.toggl.com/app/#profile](https://www.toggl.com/app/#profile).

##### Here are the ways to specify your API key: #####

#### options.apiKey
Type: `String`
Default value: ``

This is one way to specify your Toggl API key.

#### options.settingsFile
Type: `String`
Default value: `.toggl`

This is another way to specify your Toggl API Key. Enter a filename to a
JSON file that contains the key "apiKey" and value with your Toggl API key.

```
{
  "apiKey":     "demokeydemokeydemokey",
  "workspace":  12345
  "project":    1111111
}
```

You can also specify the workspace here.

This format is useful if you keep your Gruntfile in version control and don't
want your API key in it (e.g. add your `.toggl` file to your `.gitignore`).

##### Other options #####

#### options.workspace
Type: `Integer`
Default value: `null`

OPTIONAL (if specified in settingsFile). Equivalent to `options.data.wid`.
Specify the Toggl Workspace ID that newly created time entries should go into.

#### options.project
Type: `Integer`
Default value: `null`

OPTIONAL. Equivalent to `options.data.pid`. Specify the Toggl Project ID that
newly created time entries should go into.

#### options.data
Type: `Object`
Default value: `{}`

The `data` object can take any values from the toggl `time_entries` API
endpoint:

* description: (string, strongly suggested to be used)
    * I like to use the `package.json` name in the description, assuming you
      have it loaded into the pkg variable
      (`pkg: grunt.file.readJSON('package.json')`):

      ```
      data: {
        description: '<%= pkg.name %>',
      }
      ```

* wid: workspace ID (integer, **required** if pid or tid not supplied).
    * See [Finding your workspace IDs](#finding-your-workspace-ids) for
      how to get the ID using this grunt task.
* pid: project ID (integer, not required)
    * See [Finding your project IDs](#finding-your-project-ids) for
      how to get the ID using this grunt task.
* tid: task ID (integer, not required)
* billable: (boolean, not required, default false, available for pro
  workspaces)
* start: time entry start time (string, **required**, ISO 8601 date and time)
* stop: time entry stop time (string, not required, ISO 8601 date and time)
* duration: time entry duration in seconds. If the time entry is currently
  running, the duration attribute contains a negative value, denoting the
  start of the time entry in seconds since epoch (Jan 1 1970). The correct
  duration can be calculated as current_time + duration, where current_time is
  the current time in seconds since epoch. (integer, **required**)
* created_with: the name of your client app (string, **required**)
* tags: a list of tag names (array of strings, not required)
* duronly: should Toggl show the start and stop time of this time entry?
  (boolean, not required)
* at: timestamp that is sent in the response, indicates the time item was last
  updated

See this doc for the latest properties available for the API:
[https://github.com/toggl/toggl_api_docs/blob/master/chapters/time_entries.md](https://github.com/toggl/toggl_api_docs/blob/master/chapters/time_entries.md)

Data in this object will override the `workspace` and `project` properties for
`data.wid` and `data.pid`

### Usage Examples

#### Finding your workspace IDs

Use:
```
grunt toggl:MYTASK:workspaces
```
To get a JSON list of workspaces. `MYTASK` should be whatever task you have
configured, since you still need a valid API Key to get the workspaces.

*OR* just run the task without a workspace set. It will list your workspaces
by default.

#### Finding your project IDs

Use:
```
grunt toggl:MYTASK:projects
```
To get a JSON list of projects in the configured workspace. Your task needs to
have a Workspace ID properly setup in order to use this argument (valid
`workspace` or `wid` set in the options).

#### Default Options

```js
grunt.initConfig({
  toggl: {
    options: {
      settingsFile: '.toggl',
      workspace: null,
    }
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding
style. Add unit tests for any new or changed functionality. Lint and test your
code using [Grunt](http://gruntjs.com/).

## TODO

 * `debug` option that deletes time entries as soon as they're created.

## Release History

```
* 2014-04-29   v0.2.0    [ADDED]    argument for listing projects in a workspace
                         [CHANGED]  arg for listing workspaces
* 2014-04-28   v0.1.1    Alpha READY. It works.
* 2014-04-28   v0.1.0    Work in progress, not ready.
```
