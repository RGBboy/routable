/**
 * Module dependencies.
 */

var should = require('should'),
    routable = require('../');

describe('Routable', function () {

  describe('.version', function () {

    it('should match the format x.x.x', function (done) {
      routable.version.should.match(/^\d+\.\d+\.\d+$/);
      done();
    });

  });

  describe('.extend', function () {

    it('should be a function', function (done) {
      routable.extend.should.be.a.function;
      done();
    });

  });

});