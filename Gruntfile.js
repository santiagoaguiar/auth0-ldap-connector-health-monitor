module.exports = function (grunt) {
  var request   = require('superagent-bluebird-promise');
  var Promise   = require('bluebird');
  var DEV_PATH  = 'extensions/develop/extensions.json';
  var BASE_PATH = 'extensions/extensions.json';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      release: {
        files: [
          { expand: true, flatten: true, src: 'extensions.json', dest: 'release/' }
        ]
      }
    },
    aws_s3: {
      options: {
        accessKeyId:     process.env.S3_KEY,
        secretAccessKey: process.env.S3_SECRET,
        bucket:          process.env.S3_BUCKET,
        region:          process.env.S3_REGION,
        uploadConcurrency: 5,
        params: {
          CacheControl: 'public, max-age=300'
        },
        // debug: true <<< use this option to test changes
      },
      clean: {
        files: [
          { action: 'delete', dest: BASE_PATH },
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
          { action: 'delete', dest: DEV_PATH }
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
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-aws-s3');
  grunt.loadNpmTasks('grunt-http');

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

  grunt.registerTask('cdn',       ['copy:release', 'aws_s3:clean', 'aws_s3:publish', 'http:purge_json', 'purge-extensions']);

  grunt.registerTask('cdn-dev',   ['copy:release', 'aws_s3:clean_dev', 'aws_s3:publish_dev', 'http:purge_json_dev', 'purge-extensions']);
};
