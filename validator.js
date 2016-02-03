var expect     = require('chai').expect
var extensions = require('./extensions.json');

// "title": "Auth0 Webhooks",
// "name": "auth0-webhooks",
// "version": "1.0.0",
// "author": "auth0",

// "description": "Allows you to define webhooks for Auth0's Management API. It will go through the audit logs and call a webhook for specific events.",
// "type": "cron",

describe('Check scheme for each', function () {
  function iterator(callback) {
    extensions.forEach(function (ext) {
      callback(ext);
    });
  }

  describe('extension', function () {

    it('should be compliant with the properties scheme', function () {
      var properties = ['title', 'name', 'version', 'author', 'description', 'type', 'logoUrl', 'keywords', 'schedule', 'secrets'];

      iterator(function (ext) {
        Object.keys(ext).forEach(function (key) {
          expect(properties).to.include(key, '"'+key+'" is not a valid property');
        });
      });
    });

    // TITLE
    describe('property "title"', function () {
      it('should exists', function () {
        iterator(function (ext) {
          expect(ext).to.have.property('title');
        });
      });

      it('should be string', function () {
        iterator(function (ext) {
          expect(ext.title).to.be.a('string');
        });
      });

      it('should not be empty', function () {
        iterator(function (ext) {
          expect(ext.title).not.to.be.empty;
        });
      });
    });

    // NAME
    describe('property "name"', function () {
      it('should exists', function () {
        iterator(function (ext) {
          expect(ext).to.have.property('name');
        });
      });

      it('should be string', function () {
        iterator(function (ext) {
          expect(ext.title).to.be.a('string');
        });
      });

      it('should not be empty', function () {
        iterator(function (ext) {
          expect(ext.name).not.to.be.empty;
        });
      });

      it('should not have spaces', function () {
        iterator(function (ext) {
          expect(ext.name).to.not.match(/ /g);
        });
      });
    });

    // VERSION
    describe('property "version"', function () {
      it('should exists', function () {
        iterator(function (ext) {
          expect(ext).to.have.property('version');
        });
      });

      it('should be string', function () {
        iterator(function (ext) {
          expect(ext.title).to.be.a('string');
        });
      });

      it('should not be empty', function () {
        iterator(function (ext) {
          expect(ext.version).not.to.be.empty;
        });
      });

      it('should be formatted as x.y.z', function () {
        iterator(function (ext) {
          expect(ext.version).to.match(/^(\d+\.)?(\d+\.)?(\*|\d+)$/g);
        });
      });
    });

    // AUTHOR
    describe('property "author"', function () {
      it('should exists', function () {
        iterator(function (ext) {
          expect(ext).to.have.property('author');
        });
      });

      it('should be string', function () {
        iterator(function (ext) {
          expect(ext.title).to.be.a('string');
        });
      });

      it('should not be empty', function () {
        iterator(function (ext) {
          expect(ext.author).not.to.be.empty;
        });
      });
    });

    // DESCRIPTION
    describe('property "description"', function () {
      it('should exists', function () {
        iterator(function (ext) {
          expect(ext).to.have.property('description');
        });
      });

      it('should be string', function () {
        iterator(function (ext) {
          expect(ext.title).to.be.a('string');
        });
      });

      it('should not be empty', function () {
        iterator(function (ext) {
          expect(ext.description).not.to.be.empty;
        });
      });
    });

    // TYPE
    describe('property "type"', function () {
      it('should exists', function () {
        iterator(function (ext) {
          expect(ext).to.have.property('type');
        });
      });

      it('should be string', function () {
        iterator(function (ext) {
          expect(ext.title).to.be.a('string');
        });
      });

      it('should not be empty', function () {
        iterator(function (ext) {
          expect(ext.type).not.to.be.empty;
        });
      });

      it('should be "cron" or "application"', function () {
        iterator(function (ext) {
          expect(ext.type).match(/cron|application/);
        });
      });
    });

    // KEYWORDS
    describe('property "keywords"', function () {
      it('should be array', function () {
        iterator(function (ext) {
          if (ext.keywords) {
            expect(ext.keywords).to.be.an('array');
          }
        });
      });

      it('should not be empty', function () {
        iterator(function (ext) {
          if (ext.keywords) {
            expect(ext.keywords).not.to.be.empty;
          }
        });
      });

      it('should be a collection of non empty strings', function () {
        iterator(function (ext) {
          if (ext.keywords) {
            ext.keywords.forEach(function (keyword) {
              expect(keyword).not.to.be.empty;
              expect(keyword).to.be.a('string');
            });
          }
        });
      });
    });

    // SCHEDULE
    describe('property "schedule"', function () {
      describe('when type = "cron"', function () {
        it('should exists', function () {
          iterator(function (ext) {
            if (ext.type === 'cron') {
              expect(ext).to.have.property('schedule');
            }
          });
        });

        it('should be string', function () {
          iterator(function (ext) {
            if (ext.type === 'cron') {
              expect(ext.title).to.be.a('string');
            }
          });
        });

        it('should not be empty', function () {
          iterator(function (ext) {
            if (ext.type === 'cron') {
              expect(ext.schedule).not.to.be.empty;
            }
          });
        });
      });

      describe('when type = "application"', function () {
        it('should not exists', function () {
          iterator(function (ext) {
            if (ext.type === 'application') {
              expect(ext).to.not.have.property('schedule');
            }
          });
        });
      });
    });

    // SECRETS
    describe('property "secrets"', function () {
      it('should be an object', function () {
        iterator(function (ext) {
          if (ext.secrets) {
            expect(ext.secrets).to.be.an('object');
          }
        });
      });

      it('should not be empty', function () {
        iterator(function (ext) {
          if (ext.secrets) {
            expect(ext.secrets).not.to.be.empty;
          }
        });
      });

      describe('a secret', function () {
        function secretIterator (callback) {
          iterator(function (ext) {
            if (ext.secrets) {
              Object.keys(ext.secrets).forEach(function (secret) {
                callback(ext.secrets[secret]);
              });
            }
          });
        }

        it('should be compliant with the properties scheme', function () {
          var properties = ['description', 'readOnly', 'type', 'example', 'required', 'default'];

          secretIterator(function (secret) {
            Object.keys(secret).forEach(function (key) {
              expect(properties).to.include(key, '"'+key+'" is not a valid property for a secret');
            });
          });
        });

        it('should not be empty', function () {
          secretIterator(function (secret) {
            expect(Object.keys(secret)).to.not.be.empty;
          });
        });

        // DESCRIPTION
        describe('property "description"', function () {
          it('should be string', function () {
            secretIterator(function (secret) {
              if (secret.description) {
                expect(secret.description).to.be.a('string');
              }
            });
          });

          it('should not be empty', function () {
            secretIterator(function (secret) {
              if (secret.description) {
                expect(secret.description).not.to.be.empty;
              }
            });
          });
        });

        // READONLY
        describe('property "readOnly"', function () {
          it('should be boolean', function () {
            secretIterator(function (secret) {
              if (secret.readOnly) {
                expect(secret.readOnly).to.be.a('boolean');
              }
            });
          });
        });

        // TYPE
        describe('property "type"', function () {
          it('should be string', function () {
            secretIterator(function (secret) {
              if (secret.type) {
                expect(secret.type).to.be.a('string');
              }
            });
          });

          it('should not be empty', function () {
            secretIterator(function (secret) {
              if (secret.type) {
                expect(secret.type).not.to.be.empty;
              }
            });
          });

          it('should be "text" or "password"', function () {
            secretIterator(function (secret) {
              if (secret.type) {
                expect(secret.type).match(/text|password/);
              }
            });
          });
        });

        // EXAMPLE
        describe('property "example"', function () {
          it('should be string', function () {
            secretIterator(function (secret) {
              if (secret.example) {
                expect(secret.example).to.be.a('string');
              }
            });
          });

          it('should not be empty', function () {
            secretIterator(function (secret) {
              if (secret.example) {
                expect(secret.example).not.to.be.empty;
              }
            });
          });
        });

        // REQUIRED
        describe('property "required"', function () {
          it('should be boolean', function () {
            secretIterator(function (secret) {
              if (secret.required) {
                expect(secret.required).to.be.a('boolean');
              }
            });
          });
        });
      });
    });

  });
});
