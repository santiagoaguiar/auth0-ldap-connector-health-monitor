var expect     = require('chai').expect
var extensions = require('./extensions.json');
var Validator  = require('webtask-json-validator');

describe('Check scheme for each', function () {
  extensions.forEach(function (ext) {
    it('validate ' + ext.name, function () {
      expect(Validator.validate(ext).isValid, ext.name).to.be.true;
    })
  })
});
