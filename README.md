# grunt-toggl

> Toggl API for Grunt. E.g. start time tracking with `grunt watch` or `grunt toggl`

## Getting Started
This plugin requires Grunt `~0.4.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-toggl --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-toggl');
```

## The "toggl" task

### Overview
In your project's Gruntfile, add a section named `toggl` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  toggl: {
    options: {
      apiKey:       '',
      settingsFile: ''
    }
  },
});
```

### Options

Your Toggl API key is required for this task. Get it from your profile on
Toggl.com (https://www.toggl.com/app/#profile).

Here are the ways to specify your API key:

#### options.apiKey
Type: `String`
Default value: ``

This is one way to specify your Toggl.com API key.

#### options.settingsFile
Type: `String`
Default value: ``

This is another way to specify your Toggl API Key. Set this to the path to a
JSON file in this format:
```
{
  "apiKey": "MYKEY"
}
```

This format is useful if you keep your Gruntfile in version control and don't
want your API key in it. You can keep the settings file outside of your
repository, or add it to your `.gitignore`. Or you could add your key to your
`package.json` with this option.

### Usage Examples

#### Default Options

```js
grunt.initConfig({
  toggl: {
    options: {
      apiKey: 'MYAPIKEY'
    }
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding
style. Add unit tests for any new or changed functionality. Lint and test your
code using [Grunt](http://gruntjs.com/).

## Release History

 * 2014-04-28   v0.1.0    Work in progress, not ready.
