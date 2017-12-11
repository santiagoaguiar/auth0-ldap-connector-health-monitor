var expect       = require('chai').expect
var extensions   = require('./release/extensions.json');
var exnAppliance = require('./release/extensions-appliance.json');
var Validator    = require('webtask-json-validator');

describe('Checking the cloud scheme for each ', function () {
  extensions.forEach(function (ext) {
    it('validate ' + ext.name, function () {
      expect(Validator.validate(ext).isValid, ext.name).to.be.true;
    });
  });
});

describe('Checking the appliance scheme for each ', function () {
  exnAppliance.forEach(function (ext) {
    it('validate ' + ext.name, function () {
      expect(Validator.validate(ext).isValid, ext.name).to.be.true;
    });
  });
});
