module.exports = function (grunt) {
  var path = require('path');
  var join = path.join;
  var fs = require('fs');
  var read = fs.readFileSync;

  var BASE_PATH = 'extensions/extensions.json';

  var pkg = require('./package');
  var path = require('path');

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
      }
    },
    http: {
      purge_json: {
        options: {
          url: process.env.CDN_ROOT + '/' + BASE_PATH,
          method: 'DELETE'
        }
      },
      purge_social_extension: {
        options: {
          url: process.env.CDN_ROOT + '/' + 'custom-social-connections/custom-social-connections-1.0.js',
          method: 'DELETE'
        }
      },
      purge_auth0_webhook: {
        options: {
          url: process.env.CDN_ROOT + '/' + 'auth0-webhooks/auth0-webhooks-1.0.js',
          method: 'DELETE'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-aws-s3');
  grunt.loadNpmTasks('grunt-http');
  grunt.loadNpmTasks('grunt-webpack');

  grunt.registerTask('purge_cdn', ['http:purge_json', 'http:purge_social_extension', 'http:purge_auth0_webhook']);
  grunt.registerTask('cdn',       ['copy:release', 'aws_s3:clean', 'aws_s3:publish', 'purge_cdn']);
};
