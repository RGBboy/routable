/**
 * Module dependencies.
 */

var express = require('express'),
    should = require('should'),
    request = require('superagent'),
    routable = require('../');

describe('Named Routes', function () {

  describe('.version', function () {

    it('should match the format x.x.x', function (done) {
      routable.version.should.match(/^\d+\.\d+\.\d+$/);
      done();
    });

  });

});