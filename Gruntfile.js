module.exports = function (grunt) {
  var request   = require('superagent-bluebird-promise');
  var Promise   = require('bluebird');
  var DEV_PATH  = 'extensions/develop/extensions.json';
  var BASE_PATH = 'extensions/extensions.json';

  var DEV_APPLIANCE_PATH  = 'extensions/develop/extensions-appliance.json';
  var BASE_APPLIANCE_PATH = 'extensions/extensions-appliance.json';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    aws_s3: {
      options: {
        accessKeyId:     process.env.S3_KEY,
        secretAccessKey: process.env.S3_SECRET,
        bucket:          process.env.S3_BUCKET,
        region:          process.env.S3_REGION,
        uploadConcurrency: 5,
        params: {
          CacheControl: 'max-age=300'
        },
      },
      clean: {
        files: [
          { action: 'delete', dest: BASE_PATH },
          { action: 'delete', dest: BASE_APPLIANCE_PATH }
        ]
      },
      publish: {
        files: [
          {
            expand: true,
            cwd:    'release/',
            src:    ['**'],
            dest:   'extensions/'
          }
        ]
      },

      clean_dev: {
        files: [
          { action: 'delete', dest: DEV_PATH },
          { action: 'delete', dest: DEV_APPLIANCE_PATH }
        ]
      },

      publish_dev: {
        files: [
          {
            expand: true,
            cwd:    'release/',
            src:    ['**'],
            dest:   'extensions/develop'
          }
        ]
      }
    },
    http: {
      purge_json: {
        options: {
          url: process.env.CDN_ROOT + '/' + BASE_PATH,
          method: 'DELETE'
        }
      },
      purge_json_dev: {
        options: {
          url: process.env.CDN_ROOT + '/' + DEV_PATH,
          method: 'DELETE'
        }
      },
      purge_json: {
        options: {
          url: process.env.CDN_ROOT + '/' + BASE_APPLIANCE_PATH,
          method: 'DELETE'
        }
      },
      purge_json_dev: {
        options: {
          url: process.env.CDN_ROOT + '/' + DEV_APPLIANCE_PATH,
          method: 'DELETE'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-aws-s3');
  grunt.loadNpmTasks('grunt-http');

  grunt.registerTask('purge-extensions-logos', function () {
    var done       = this.async();
    var promises   = [];
    var extensions = grunt.file.readJSON('extensions.json');

    extensions.forEach(function (ext) {
      var name    = ext.name;
      var version = ext.version.split('.').slice(0,2).join('.');
      var cdn     = process.env.CDN_ROOT;
      var url     = cdn + '/extensions/' + name + '/assets/logo.svg';

      grunt.log.ok(url);
      promises.push(request.del(url).promise());
    });

    Promise.all(promises)
      .then(function () {
        done();
      })
      .catch(function (err) {
        grunt.log.subhead('Error purging extensions');
        grunt.log.writeln();
        grunt.log.error(err);
      });
  });

  grunt.registerTask('purge-extensions', function () {
    var done       = this.async();
    var promises   = [];
    var extensions = grunt.file.readJSON('extensions.json');

    extensions.forEach(function (ext) {
      var name    = ext.name;
      var version = ext.version.split('.').slice(0,2).join('.');
      var cdn     = process.env.CDN_ROOT;
      var url     = cdn + '/extensions/' + name + '/' + name + '-' + version + '.js';

      grunt.log.ok(url);
      promises.push(request.del(url).promise());
    });

    Promise.all(promises)
      .then(function () {
        done();
      })
      .catch(function (err) {
        grunt.log.subhead('Error purging extensions');
        grunt.log.writeln();
        grunt.log.error(err);
      });
  });

  grunt.registerTask('build-extensions', function(environmentName) {
    var extensions = grunt.file.readJSON('extensions.json');
    var fileName   = !!environmentName ? `extensions-${environmentName}.json` : 'extensions.json';

    var extensions = extensions.reduce(function(exts, ext) {
      var environments = ext.environments || [];
      var environment  = environments.find(function(env) {
        return env.name === environmentName;
      }) || {};

      // Handle environment specific extension filtering
      if (environment.filter === true) {
        return exts;
      }

      // Handle environment specific property overrides.
      if (environment.overrides) {
        Object.keys(environment.overrides).forEach(function(propertyName) {
          ext[propertyName] = environment.overrides[propertyName];
        });
      }

      // Cleaning up environments property from generated extension files.
      delete ext.environments;

      exts.push(ext);
      return exts;
    }, []);

    grunt.file.write(`./release/${fileName}`, JSON.stringify(extensions, null, 2));
  });

  grunt.registerTask('build', [
    'build-extensions',
    'build-extensions:appliance',
  ]);

  grunt.registerTask('deploy', [
    'aws_s3:clean',
    'aws_s3:publish'
  ]);

  grunt.registerTask('deploy-dev', [
    'aws_s3:clean_dev',
    'aws_s3:publish_dev'
  ]);
};
